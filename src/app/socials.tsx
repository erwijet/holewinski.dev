import { FaGithub, FaLinkedinIn, FaMastodon, FaSpotify } from "react-icons/fa";
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
        <FaLinkedinIn />
        <Text>Linkedin &#8212;</Text>
        <Link href="https://linkedin.com/in/tylerholewinski">
          in/tylerholewinski
        </Link>
      </HStack>

      <HStack>
        <FaMastodon />
        <Text>Mastodon &#8212;</Text>
        <Link href="https://social.holewinski.dev/@tyler">
          @tyler@holewinski.dev
        </Link>
      </HStack>

      <HStack>
        <FaSpotify />
        <Text>Spotify &#8212;</Text>
        <Link href="https://goto.holewinski.dev/spotify">
          Tyler Holewinski{" "}
        </Link>
      </HStack>
    </Stack>
  );
};
