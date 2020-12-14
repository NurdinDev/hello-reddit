import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { PostSnippetFragment } from '../generated/graphql';
import { VoteSection } from './VoteSection';
import { NextChakraLink } from './NextChakraLink';
import { EditDeletePostButtons } from './EditDeletePostButtons';

const PostCard: React.FC<{ post: PostSnippetFragment }> = ({ post }) => {
    const { id, title, textSnippet, creatorId } = post;
    return (
        <Box d="flex" shadow="md" borderWidth="1px" position="relative">
            <Flex p="3" flexDirection="column" alignItems="center">
                <VoteSection post={post} />
            </Flex>
            <Box p="5">
                <NextChakraLink href={`/post/${id}`}>
                    <Heading fontSize="xl">{title} </Heading>
                </NextChakraLink>
                <Text mt="4">{textSnippet}</Text>
                <EditDeletePostButtons id={id} creatorId={creatorId} />
            </Box>
        </Box>
    );
};

export default PostCard;
