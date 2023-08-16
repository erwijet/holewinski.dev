"use client";

import { mapKeys } from "@bryx-inc/ts-utils";
import site from '@/site.json';

import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  useColorModeValue,
  LinkProps,
  Stack,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  MutableRefObject,
  forwardRef,
} from "react";
import { FaBars } from "react-icons/fa";

type LinkItemProps = {
  path: string;
} & LinkProps;

const LinkItem = ({ children, ...rest }: Omit<LinkItemProps, "path">) => {
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

const MenuLinkItem = forwardRef<MutableRefObject<HTMLAnchorElement>, LinkProps>(
  (props, ref) => <Link ref={ref} {...props} />
);

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
          {mapKeys(site.links, (key) => (
            <LinkItem key={key} href={site.links[key]}>
              {key}
            </LinkItem>
          ))}
        </Stack>

        <Box ml={2} display={{ base: "inline-block", md: "none" }}>
          <Menu isLazy id="navbar-menu">
            <MenuButton
              as={IconButton}
              icon={<FaBars />}
              variant="outline"
              aria-label="Options"
            />
            <MenuList>
              {mapKeys(site.links, (key) => (
                <MenuItem key={key} as={MenuLinkItem} href={site.links[key]}>
                  {key}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Container>
    </Box>
  );
};
