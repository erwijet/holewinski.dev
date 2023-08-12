'use client';

import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  useColorModeValue,
  LinkProps,
  Stack,
} from "@chakra-ui/react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type LinkItemProps = {
  path: string;
} & LinkProps;

const LinkItem = ({ children, ...rest }: Omit<LinkItemProps, 'path'>) => {
  return (
    <Link
      p={2}
      color={useColorModeValue("gray.800", "whiteAlpha.900")}
      {...rest}
    >
      {children}
    </Link>
  );
};

export type NavbarProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export const Navbar = (props: NavbarProps) => {
  return (
    <Box
      position={"fixed"}
      top={0}
      as="nav"
      w="100%"
      bg={useColorModeValue("#ffffff40", "#20202380")}
      css={{ backdropFilter: "blur(10px)" }}
      zIndex={2}
      {...props}
    >
      <Container
        display={"flex"}
        p={2}
        maxW="container.md"
        flexWrap={"wrap"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Flex align={"center"} mr={5}>
          <Heading
            as="h1"
            size="md"
            letterSpacing={"tighter"}
            display={"inline"}
          >
            // Tyler Holewinski
          </Heading>
        </Flex>

        <Stack
          direction={{ base: "column", md: "row" }}
          display={{ base: "none", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          flexGrow={1}
          mt={{ base: 4, md: 0 }}
        >
          <LinkItem href="https://resume.holewinski.dev">resume</LinkItem>
          <LinkItem href="https://github.com/erwijet/holewinski.dev">source</LinkItem>
          <LinkItem href="https://linkedin.com/in/tylerholewinski ">linkedin</LinkItem>
        </Stack>
      </Container>
    </Box>
  );
};
