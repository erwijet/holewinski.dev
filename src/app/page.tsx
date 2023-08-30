"use client";

import {
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Link,
  Stack,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import Image from "next/image";
import { Navbar } from "src/common/Navbar";
import { Socials } from "src/app/socials";
import TylerHead from "../assets/tyler-head.png";

import { SpotifyCard } from "src/common/SpotifyCard";
import { MiniBio } from "./minibio";

const ProfileImage = chakra(Image, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt"].includes(prop),
});
const App = () => {
  return (
    <>
      <Navbar />
      <Container mt={[20, 24]} gap={"16px"} maxWidth={"80ch"}>
        <Flex
          justifyContent={"space-between"}
          direction={["column-reverse", "row"]}
          alignItems={"center"}
          gap={8}
          pb={8}
        >
          <VStack
            pl={"4"}
            alignSelf={["start", "center"]}
            borderLeft={"2px"}
            borderColor="whiteAlpha.700"
            alignItems={"flex-start"}
          >
            <Heading>Tyler Holewinski</Heading>
            <MiniBio />
          </VStack>
          <ProfileImage
            height={"150"}
            minWidth={"150"}
            width={"150"}
            alt="profile photo"
            src={TylerHead}
            borderRadius={"full"}
            border={"2px"}
          />
        </Flex>
        <Stack gap="8px">
          <Heading size="lg" my="8px">
            Hey there
          </Heading>
          <Text>
            My name is Tyler. I'm a Rochester-based fullstack web developer in
            New York. I'm working full-time, while also persuing my B.S. at{" "}
            <Link href="https://rit.edu">RIT</Link>. I'd love to tell you a
            little about myself.
          </Text>
        </Stack>
        <Divider my={"8"} />
        <Stack gap={"8px"}>
          <HStack justifyContent={"space-between"} wrap={"wrap"}>
            <SpotifyCard />
            <Socials />
          </HStack>
        </Stack>
        <Divider my={"8"} />
      </Container>
    </>
  );
};

export default App;
