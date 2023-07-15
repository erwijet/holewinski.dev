"use client";

import {
  Container,
  HStack,
  VStack,
  Heading,
  Text,
  chakra,
} from "@chakra-ui/react";
import Image from "next/image";
import { Navbar } from "src/common/Navbar";
import TylerHead from "../assets/tyler-head.png";

const ProfileImage = chakra(Image, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt"].includes(prop),
});

const App = () => {
  return (
    <>
      <Navbar />
      <Container mt={"24"} gap={"8"} maxWidth={"80ch"}>
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

        {/* <Divider } /> */}

        <Text>Hey</Text>
      </Container>
    </>
  );
};

export default App;
