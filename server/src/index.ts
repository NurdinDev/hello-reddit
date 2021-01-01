import { Post } from './entity/Post';
import { User } from './entity/User';
import { Upvote } from './entity/Upvote';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { __prod__, COOKI_NAME } from './constants';
import { PostResolver } from './resolvers/posts';
import { UserResolver } from './resolvers/users';
import { createUserLoader } from './utils/createUserLoader';
import { createUpVoteLoader } from './utils/createUpVoteLoader';
import path from 'path';

const main = async () => {
    let retries = 5;

    while (retries) {
        try {
            const conn = __prod__
                ? await createConnection({
                      type: 'postgres',
                      url: process.env.DATABASE_URL,
                      logging: true,
                      migrations: [path.join(__dirname, './migration/*')],
                      entities: [Post, User, Upvote],
                  })
                : await createConnection();
            if (__prod__) {
                console.log('Running migration 🚀');
                if (process.env.NODE_ENV === 'production') {
                    await conn.runMigrations();
                }
                console.log('Migration Done! 🚀');
            }
            break;
        } catch (err) {
            console.log(err);
            retries -= 1;
            console.log(`retries left: ${retries}`);
            // wait 5 seconds
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
    const app = express();

    let RedisStore = connectRedis(session);
    let redis = new Redis(process.env.REDIS_URL);
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        }),
    );

    if (__prod__) {
        app.set('trust proxy', 1); // trust first proxy
    }

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
                domain: __prod__ ? '.nurdin.dev' : undefined,
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
        console.log(`server started on ${process.env.PORT}`);
    });
};

main().catch((err) => {
    console.error(err);
});
