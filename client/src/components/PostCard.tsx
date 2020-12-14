import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { PostSnippetFragment } from '../generated/graphql';
import { VoteSection } from './VoteSection';
import { NextChakraLink } from './NextChakraLink';

const PostCard: React.FC<{ post: PostSnippetFragment }> = ({ post }) => {
    const { id, title, textSnippet } = post;
    return (
        <Box d="flex" shadow="md" borderWidth="1px">
            <Flex p="3" flexDirection="column" alignItems="center">
                <VoteSection post={post} />
            </Flex>
            <Box p="5">
                <NextChakraLink href={`/post/${id}`}>
                    <Heading fontSize="xl">{title} </Heading>
                </NextChakraLink>
                <Text mt="4">{textSnippet}</Text>
            </Box>
        </Box>
    );
};

export default PostCard;
