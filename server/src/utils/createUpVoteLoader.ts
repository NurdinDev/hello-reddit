import DataLoader from 'dataloader';
import { Upvote } from '../entity/Upvote';

interface inputType {
    postId: number;
    userId: number;
}

export const createUpVoteLoader = () =>
    new DataLoader<inputType, Upvote | null>(async (keys) => {
        const upvotes = await Upvote.findByIds(keys as inputType[]);
        const votesIdToVote: Record<string, Upvote> = {};

        upvotes.forEach((v) => {
            votesIdToVote[`${v.userId}|${v.postId}`] = v;
        });

        return keys.map((k) => votesIdToVote[`${k.userId}|${k.postId}`]);
    });
