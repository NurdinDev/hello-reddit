import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { PostSnippetFragment } from '../generated/graphql';
import { VoteSection } from './VoteSection';
import { NextChakraLink } from './NextChakraLink';
import { EditDeletePostButtons } from './EditDeletePostButtons';

const PostCard: React.FC<{ post: PostSnippetFragment }> = ({ post }) => {
    const {
        id,
        title,
        textSnippet,
        creator: { id: creatorId },
    } = post;
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
                <Box position="absolute" top={0} right={0} bottom={0}>
                    <EditDeletePostButtons id={id} creatorId={creatorId} />
                </Box>
            </Box>
        </Box>
    );
};

export default PostCard;
