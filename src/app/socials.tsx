import { FaGithub, FaLinkedinIn, FaMastodon, FaTwitter } from "react-icons/fa";
import { HStack, Link, Stack, Text } from "@chakra-ui/react";

export const Socials = () => {
  return (
    <Stack ml="16px">
      <HStack>
        <FaGithub />
        <Text>GitHub &#8212;</Text>
        <Link href="https://github.com/erwijet">erwijet</Link>
      </HStack>

      <HStack>
        <FaTwitter />
        <Text>Twitter &#8212;</Text>
        <Link href="https://twitter.com/erwijet">erwijet</Link>
      </HStack>

      <HStack>
        <FaLinkedinIn />
        <Text>Linkedin &#8212;</Text>
        <Link href="https://linkedin.com/in/tylerholewinski">
          in/tylerholewinski
        </Link>
      </HStack>

      <HStack>
        <FaMastodon />
        <Text>Mastodon &#8212;</Text>
        <Link href="https://mastodon.social/@erwijet">
          erwijet@mastodon.social
        </Link>
      </HStack>
    </Stack>
  );
};
