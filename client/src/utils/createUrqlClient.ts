import Router from 'next/router';
import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from '../generated/graphql';
import { betterUpdateQuery } from './betterUpdateQuery';
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import { Cache } from '@urql/exchange-graphcache/dist/types/types';

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

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const,
    },
    exchanges: [dedupExchange, cache, errorExchange, ssrExchange, fetchExchange],
});
