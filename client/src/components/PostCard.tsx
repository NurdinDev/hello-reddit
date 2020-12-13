import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/core';

const PostCard: React.FC<{ title: string; textSnippet: string }> = ({ title, textSnippet }) => {
    return (
        <Box p="5" shadow="md" borderWidth="1px" mb="5">
            <Heading fontSize="xl">{title} </Heading>
            <Text mt="4">{textSnippet}</Text>
        </Box>
    );
};

export default PostCard;
