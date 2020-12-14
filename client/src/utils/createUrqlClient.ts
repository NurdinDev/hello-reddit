import Router from 'next/router';
import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange, gql } from 'urql';
import {
    LogoutMutation,
    MeQuery,
    MeDocument,
    LoginMutation,
    RegisterMutation,
    VoteMutationVariables,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import { Cache } from '@urql/exchange-graphcache/dist/types/types';
import { isServer } from './isServer';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error?.message.toLowerCase().includes('not authenticated')) {
                Router.replace('/login');
            }
        }),
    );
};

function invalidateAllPosts(cache: Cache) {
    const allFields = cache.inspectFields('Query');
    const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
    fieldInfos.forEach((fi) => {
        cache.invalidate('Query', 'posts', fi.arguments || {});
    });
}

const cache = cacheExchange({
    updates: {
        Mutation: {
            vote: (_result, args, cache) => {
                const { postId, value } = args as VoteMutationVariables;
                const data = cache.readFragment(
                    gql`
                        fragment _ on Post {
                            id
                            points
                            voteStatus
                        }
                    `,
                    { id: postId } as any,
                );
                if (data) {
                    if (data.voteStatus === value) {
                        return;
                    }
                    const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                    cache.writeFragment(
                        gql`
                            fragment _ on Post {
                                points
                                voteStatus
                            }
                        `,
                        { id: postId, points: newPoints, valueStatus: value } as any,
                    );
                }
                invalidateAllPosts(cache);
            },
            createPost: (_result, _args, cache) => {
                invalidateAllPosts(cache);
            },
            logout: (_result, _args, cache) => {
                betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, () => ({ me: null }));
            },
            login: (_result, _args, cache) => {
                betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
                    if (result.login.errors) {
                        return query;
                    } else {
                        return {
                            me: result.login.user,
                        };
                    }
                });
            },
            register: (_result, _args, cache) => {
                betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
                    if (result.register.errors) {
                        return query;
                    } else {
                        return {
                            me: result.register.user,
                        };
                    }
                });
            },
        },
    },
});

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = '';
    if (isServer()) {
        cookie = ctx?.req?.headers?.cookie;
    }
    return {
        url: 'http://localhost:4000/graphql',
        fetchOptions: {
            credentials: 'include' as const,
            headers: cookie
                ? {
                      cookie,
                  }
                : undefined,
        },
        exchanges: [dedupExchange, cache, errorExchange, ssrExchange, fetchExchange],
    };
};
