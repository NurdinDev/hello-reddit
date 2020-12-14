import React, { useState } from 'react';
import { IconButton, Text } from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface VoteSectionProps {
    post: PostSnippetFragment;
}

export const VoteSection: React.FC<VoteSectionProps> = ({ post }) => {
    const { points } = post;
    const [loadingState, setLoadingState] = useState<'upvote-loading' | 'downvote-loading' | 'no-loading'>(
        'no-loading',
    );
    const [, vote] = useVoteMutation();

    return (
        <>
            <IconButton
                aria-label={'up-vote'}
                size={'sm'}
                icon={<TriangleUpIcon />}
                isLoading={loadingState === 'upvote-loading'}
                colorScheme={post.voteStatus === 1 ? 'teal' : 'gray'}
                disabled={post.voteStatus === 1}
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return;
                    }
                    setLoadingState('upvote-loading');
                    await vote({
                        postId: post.id,
                        value: 1,
                    });
                    setLoadingState('no-loading');
                }}
            />
            <Text fontSize="sm">{points}</Text>
            <IconButton
                size={'sm'}
                aria-label={'down-vote'}
                icon={<TriangleDownIcon />}
                disabled={post.voteStatus === -1}
                isLoading={loadingState === 'downvote-loading'}
                colorScheme={post.voteStatus === -1 ? 'red' : 'gray'}
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return;
                    }
                    setLoadingState('downvote-loading');
                    await vote({
                        postId: post.id,
                        value: -1,
                    });
                    setLoadingState('no-loading');
                }}
            />
        </>
    );
};
