import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, errorExchange, fetchExchange, gql } from 'urql';
import {
    LogoutMutation,
    MeQuery,
    MeDocument,
    LoginMutation,
    RegisterMutation,
    VoteMutationVariables,
    DeletePostMutationVariables,
} from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { Cache } from '@urql/exchange-graphcache/dist/types/types';
import { isServer } from './isServer';
import Router from 'next/router';

// const errorExchange: Exchange = ({ forward }) => (ops$) => {
//     return pipe(
//         forward(ops$),
//         tap(({ error }) => {
//             if (error?.message.toLowerCase().includes('not authenticated')) {
//                 Router.replace('/login');
//             }
//         }),
//     );
// };

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
            deletePost: (_result, args, cache) => {
                cache.invalidate({ __typename: 'Post', id: (args as DeletePostMutationVariables).id });
            },
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
                invalidateAllPosts(cache);
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
                invalidateAllPosts(cache);
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
        url: process.env.NEXT_PUBLIC_GRAPHQL_SERVER as string,
        fetchOptions: {
            credentials: 'include' as const,
            headers: cookie
                ? {
                      cookie,
                  }
                : undefined,
        },
        exchanges: [
            dedupExchange,
            cache,
            errorExchange({
                onError: (error) => {
                    if (error?.message.toLowerCase().includes('not authenticated')) {
                        Router.replace('/login');
                    }
                },
            }),
            ssrExchange,
            fetchExchange,
        ],
    };
};
