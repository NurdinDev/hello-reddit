import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { PostSnippetFragment } from '../generated/graphql';
import { VoteSection } from './VoteSection';

const PostCard: React.FC<{ post: PostSnippetFragment }> = ({ post }) => {
    const { title, textSnippet } = post;
    return (
        <Box d="flex" shadow="md" borderWidth="1px">
            <Flex p="1" flexDirection="column" alignItems="center">
                <VoteSection post={post} />
            </Flex>
            <Box p="5">
                <Heading fontSize="xl">{title} </Heading>
                <Text mt="4">{textSnippet}</Text>
            </Box>
        </Box>
    );
};

export default PostCard;
