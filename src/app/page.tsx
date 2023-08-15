"use client";

import {
  Container,
  Divider,
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

const ProfileImage = chakra(Image, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt"].includes(prop),
});
const App = () => {
  return (
    <>
      <Navbar />
      <Container mt={"24"} gap={"16px"} maxWidth={"80ch"}>
        <HStack justifyContent={"space-between"}>
          <VStack p={"8"} rounded="lg">
            <Heading>Tyler Holewinski</Heading>
            <Text>Software Engineer & Coffee Lover</Text>
          </VStack>
          <ProfileImage
            height={"200"}
            width={"200"}
            alt="profile photo"
            src={TylerHead}
            borderRadius={"full"}
            border={"2px"}
          />
        </HStack>
        <Stack gap="8px">
          <Heading size="lg" my="8px">
            Hey there!
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
          <HStack justifyContent={"space-between"}>
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
