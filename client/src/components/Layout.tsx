import React from "react";
import { NavBar } from "./NavBar";
import { variantType, Wrapper } from "./Wrapper";

interface LayoutProps {
  variant?: variantType;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
