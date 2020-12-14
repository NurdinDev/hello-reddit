import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';
import { DeleteIcon } from '@chakra-ui/icons';

interface EditDeletePostButtonsProps {
    id: number;
    creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId }) => {
    const [{ data: meData }] = useMeQuery();
    const [, deletePost] = useDeletePostMutation();

    if (meData?.me?.id !== String(creatorId)) {
        return null;
    }

    return (
        <Box>
            <IconButton
                variant={'clear'}
                position="absolute"
                top={0}
                right={0}
                size={'sm'}
                aria-label="delete-post"
                onClick={() => deletePost({ id })}
                icon={<DeleteIcon color={'red.500'} />}
            />
        </Box>
    );
};
