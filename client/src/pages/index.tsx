import { Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <>
    <NavBar />
    <Container>
      <Text>Example repository of.Î</Text>
    </Container>
  </>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
