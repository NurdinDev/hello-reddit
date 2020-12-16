import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { NextChakraLink } from './NextChakraLink';

interface EditDeletePostButtonsProps {
    id: number;
    creatorId: string;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId }) => {
    const [{ data: meData }] = useMeQuery();
    const [, deletePost] = useDeletePostMutation();

    if (meData?.me?.id !== creatorId) {
        return null;
    }

    return (
        <Box>
            <NextChakraLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                <IconButton variant={'clear'} size={'sm'} aria-label="delete-post" icon={<EditIcon />} />
            </NextChakraLink>

            <IconButton
                variant={'clear'}
                size={'sm'}
                aria-label="delete-post"
                onClick={() => deletePost({ id })}
                icon={<DeleteIcon />}
            />
        </Box>
    );
};
