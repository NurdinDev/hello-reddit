import { Box } from "@chakra-ui/core";
import React from "react";

export type variantType = "small" | "regular";
interface WrapperProps {
  variant?: variantType
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx={"auto"}
      maxW={variant == "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};
