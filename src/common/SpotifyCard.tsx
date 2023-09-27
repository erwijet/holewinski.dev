import { Maybe, interleave, isNone } from "@bryx-inc/ts-utils";
import { Box, Image, Link, Progress, Text } from "@chakra-ui/react";
import { FaPause } from "react-icons/fa";
import { match } from "ts-pattern";

import {
  Payload,
  useCurrentSpotifySong,
} from "@erwijet/react-spotify-current-song";
import { useState } from "react";

export const SpotifyCard = () => {
  const [data, setData] = useState<Maybe<Payload>>(null);

  useCurrentSpotifySong({
    host: "wss://spotify.holewinski.dev/ws",
    onUpdate: (payload) => setData(payload),
  });

  if (isNone(data))
    return (
      <></>
      // <Box
      //   display="flex"
      //   h="40"
      //   w="md"
      //   borderWidth={"1px"}
      //   borderRadius={"lg"}
      //   overflow={"hidden"}
      // >
      // </Box>
    );

  return match(data)
    .with({ type: "update", playing: true }, ({ data, paused }) => (
      <Box
        display="flex"
        h="40"
        w="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        pos={"relative"}
      >
        {paused && (
          <Box
            pos={"absolute"}
            w="full"
            h="full"
            bg="rgba(20, 20, 20, 0.7)"
            zIndex={1}
            display={"flex"}
            alignItems={"center"}
            pl="8"
          >
            <FaPause /> &nbsp;Paused
          </Box>
        )}
        <Image
          src={data.images.find(({ height }) => height === 640)?.url}
          alt={data.title}
          maxH="40"
          objectFit="cover"
        />

        <Box p="6">
          <Text fontWeight="semibold" fontSize="xl" mb={2}>
            Currently Listening To
          </Text>
          <Text fontSize="lg" color="gray.400">
            <Link
              href={`https://open.spotify.com/track/${
                data.track_id.split("spotify:track:")[1]
              }`}
            >
              {data.title}
            </Link>
          </Text>
          <Text fontSize="md" color="gray.600">
            {interleave(
              data.artists.map(({ name, external_urls: { spotify } }) => (
                <Link color="gray.600" href={spotify}>
                  {name}
                </Link>
              )),
              <>, </>
            )}
          </Text>
          <Progress
            value={(data.progress / data.duration) * 100}
            colorScheme="gray"
            rounded="xl"
            size="sm"
            mt={4}
          />
        </Box>
      </Box>
    ))
    .otherwise(() => <></>);
};
