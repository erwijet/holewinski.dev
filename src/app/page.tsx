"use client";

import {
  Container,
  HStack,
  VStack,
  Heading,
  Text,
  chakra,
  Stack,
  Divider,
} from "@chakra-ui/react";
import Image from "next/image";
import { Navbar } from "src/common/Navbar";
import TylerHead from "../assets/tyler-head.png";
import Buttons from "./buttons";

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
            My name is Tyler. I'm a fullstack web developer in Rochester, NY.
            I'm working full-time, while also persuing my B.S. at the Rochester
            Institute of Technology. I'd love to tell you a little about myself.
          </Text>
        </Stack>
        <Divider my={"8"} />
        <Stack gap={"8px"}>
          <Heading size={"lg"} my="8px">
            On the Web
          </Heading>
          <Buttons />
        </Stack>
        <Divider my={"8"} />
      </Container>
    </>
  );
};

export default App;
