import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import 'dotenv-safe/config';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { COOKI_NAME, __prod__ } from './constants';
import { PostResolver } from './resolvers/posts';
import { UserResolver } from './resolvers/users';
import { createUserLoader } from './utils/createUserLoader';
import { createUpVoteLoader } from './utils/createUpVoteLoader';

const main = async () => {
    await createConnection();

    // await conn.runMigrations();

    const app = express();

    let RedisStore = connectRedis(session);
    let redis = new Redis();

    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        }),
    );
    app.use(
        session({
            name: COOKI_NAME,
            store: new RedisStore({
                client: redis,
                disableTouch: false,
            }),
            cookie: {
                maxAge: 100 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__, // cookies only works on https
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false,
        }),
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            voteLoader: createUpVoteLoader(),
        }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(process.env.PORT, () => {
        console.log('server started on localhost:4000');
    });
};

main().catch((err) => {
    console.error(err);
});
