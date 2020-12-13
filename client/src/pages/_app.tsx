import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

interface appProps {
    Component: any;
    pageProps: any;
}

const MyApp: React.FC<appProps> = ({ Component, pageProps }) => {
    return (
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    );
};

export default MyApp;
