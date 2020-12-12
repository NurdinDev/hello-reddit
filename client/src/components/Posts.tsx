import React, { useState } from 'react';
import PostPage from './PostPage';

const Posts = () => {
    const [pageVariables, setPageVariable] = useState<{ cursor: null | string; limit: number }[]>([
        {
            limit: 10,
            cursor: null,
        },
    ]);

    return (
        <>
            {pageVariables.map((variables, i) => (
                <PostPage
                    key={'' + variables.cursor}
                    variables={variables}
                    isLastPage={i === pageVariables.length - 1}
                    loadMore={(cursor) =>
                        setPageVariable([
                            ...pageVariables,
                            {
                                limit: 10,
                                cursor,
                            },
                        ])
                    }
                />
            ))}
        </>
    );
};
export default Posts;
