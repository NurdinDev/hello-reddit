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
                variant={'clear'}
                icon={<TriangleUpIcon />}
                isLoading={loadingState === 'upvote-loading'}
                onClick={async () => {
                    setLoadingState('upvote-loading');
                    await vote({
                        postId: post.id,
                        value: 1,
                    });
                    setLoadingState('no-loading');
                }}
            />
            <Text size="sm">{points}</Text>
            <IconButton
                size={'sm'}
                variant={'clear'}
                aria-label={'down-vote'}
                icon={<TriangleDownIcon />}
                isLoading={loadingState === 'downvote-loading'}
                onClick={async () => {
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
