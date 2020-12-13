import React from 'react';
import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { Post } from '../generated/graphql';

const PostCard: React.FC<{ post: Post | any }> = ({ post }) => {
    const { title, textSnippet, points } = post;
    return (
        <Box d="flex" shadow="md" borderWidth="1px">
            <Flex p="1" flexDirection="column" alignItems="center">
                <IconButton aria-label={'up-vote'} size={'sm'} variant={'clear'} icon={<TriangleUpIcon />} />
                <Text size="sm">{points}</Text>
                <IconButton size={'sm'} variant={'clear'} aria-label={'down-vote'} icon={<TriangleDownIcon />} />
            </Flex>
            <Box p="5">
                <Heading fontSize="xl">{title} </Heading>
                <Text mt="4">{textSnippet}</Text>
            </Box>
        </Box>
    );
};

export default PostCard;
