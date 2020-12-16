import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createUserLoader } from './utils/createUserLoader';
import { createUpVoteLoader } from './utils/createUpVoteLoader';

export type MyContext = {
    req: Request & { session: Express.Session };
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    voteLoader: ReturnType<typeof createUpVoteLoader>;
};
