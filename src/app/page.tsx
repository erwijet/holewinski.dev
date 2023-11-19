"use client";

import {
  Container,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import Image from "next/image";
import { Socials } from "src/app/socials";
import { Navbar } from "src/common/Navbar";

import { SpotifyCard } from "src/common/SpotifyCard";
import { MiniBio } from "./minibio";
import { Wobble } from "./wobble";

import BryxBrand from "@/src/assets/bryx.jpeg";
import RitBrand from "@/src/assets/ritz.jpeg";
import Profile from "@/src/assets/profile.png";

function getFormattedTimeBetween(d1: Date, d2: Date): string {
  const millisecondsPerMonth = 30.44 * 24 * 60 * 60 * 1000; // appx

  const delta = d2.getTime() - d1.getTime();

  const years = Math.floor(delta / (millisecondsPerMonth * 12));
  const months = Math.floor(
    (delta % (millisecondsPerMonth * 12)) / millisecondsPerMonth
  );

  return `${
    years == 1 ? years + " year " : years > 1 ? years + " years " : ""
  }${months == 1 ? months + " month" : months > 1 ? months + " months" : ""}`;
}

const ChakraNextImage = chakra(Image, {
  shouldForwardProp: (prop) => ["width", "height", "src", "alt"].includes(prop),
});

const App = () => {
  return (
    <>
      <Navbar />
      <Container mt={[20, 24]} gap={"16px"} maxWidth={"85ch"}>
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
          <Wobble>
            <ChakraNextImage
              height={"250"}
              minWidth={"250"}
              width={"250"}
              alt="profile photo"
              src={Profile}
              borderRadius={"lg"}
              border={"2px"}
            />
          </Wobble>
        </Flex>
        <Stack gap="8px">
          <Heading size="lg" my="8px">
            Hey There!
          </Heading>
          <Text>
            My name is Tyler, I'm fullstack developer in New York working
            fulltime at Bryx building cloud software for first reponders. I'd
            love to tell you a little bit about myself!
          </Text>
        </Stack>
        <Divider my={"8"} />

        <Stack>
          <Heading size="lg" my="16px">
            Experience
          </Heading>
          <Flex gap="24px" direction={["column", "row"]} align={"center"}>
            <Wobble>
              <ChakraNextImage
                src={BryxBrand}
                alt="bryx logo"
                width={"150"}
                height={"150"}
                rounded={"md"}
                minWidth={"150"}
                borderRadius={"lg"}
                border={"2px"}
              />
            </Wobble>
            <Stack>
              <Flex justify={"space-between"} direction={["column", "row"]}>
                <Heading size="md">
                  <Link href="https://bryx.com">Bryx</Link> &#8212; Software
                  Engineer
                </Heading>
                <Text>
                  May 2022 &#8212; Present (
                  {getFormattedTimeBetween(new Date("2022/05/01"), new Date())})
                </Text>
              </Flex>
              <Text>
                At Bryx, I work with a small team to bring a cloud-based
                solution to first responders and their agencies by building
                software that integrate all aspects of the incident lifecycle,
                from dispatch to alerting and reporting.
              </Text>
            </Stack>
          </Flex>

          <Flex gap="24px" direction={["column", "row"]} align={"center"}>
            <Wobble>
              <ChakraNextImage
                src={RitBrand}
                alt="rit logo"
                width={"150"}
                height={"150"}
                rounded={"md"}
                minWidth={"150"}
                borderRadius={"lg"}
                border={"2px"}
              />
            </Wobble>
            <Stack>
              <Flex justify={"space-between"} direction={["column", "row"]}>
                <Heading size="md">
                  <Link href="https://rit.edu/its">RIT ITS</Link> &#8212;
                  Helpdesk Technician
                </Heading>
                <Text>
                  Sept 2021 &#8212; May 2022 (
                  {getFormattedTimeBetween(
                    new Date("2021/09/01"),
                    new Date("2022/05/01")
                  )}
                  )
                </Text>
              </Flex>
              <Text>
                While living on campus I worked at the RIT ITS helpdesk, where I
                assisted with GSuite/LDAP account management for students and
                staff, device troubleshooting, and all other level-1 techincal
                issues for the university.
              </Text>
            </Stack>
          </Flex>
        </Stack>
        <Divider my="8" />
        <Flex
          justifyContent="space-between"
          gap="16px"
          direction={["column", "row"]}
          align={["start", "center"]}
        >
          <SpotifyCard />
          <Socials />
        </Flex>
        <Divider my={"8"} />
      </Container>
    </>
  );
};

export default App;
