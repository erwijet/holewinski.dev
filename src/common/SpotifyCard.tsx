import { interleave, isNone, pipe } from "@bryx-inc/ts-utils";
import { Box, Image, Link, Progress, Text } from "@chakra-ui/react";
import useWebSocket from "react-use-websocket";
import { match } from "ts-pattern";
import { z } from "zod";

const wsMsgPayloadSchema = z.union([
  z.object({
    type: z.literal("ack"),
  }),
  z.object({
    type: z.literal("update"),
    playing: z.literal(false),
  }),
  z.object({
    type: z.literal("update"),
    playing: z.literal(true),
    paused: z.boolean(),
    data: z.object({
      title: z.string(),
      duration: z.number(),
      progress: z.number(),
      track_id: z.string(),
      artists: z
        .object({
          external_urls: z.object({ spotify: z.string() }),
          href: z.string(),
          id: z.string(),
          name: z.string(),
        })
        .array(),
      images: z
        .object({
          height: z.union([z.literal(640), z.literal(300), z.literal(64)]),
          width: z.union([z.literal(640), z.literal(300), z.literal(64)]),
          url: z.string(),
        })
        .array(),
    }),
  }),
]);

export const SpotifyCard = () => {
  const { lastMessage } = useWebSocket("wss://spotify.holewinski.dev/ws");

  if (isNone(lastMessage)) return <></>;

  return match(pipe(lastMessage.data, JSON.parse, wsMsgPayloadSchema.parse))
    .with({ type: "update", playing: true }, ({ data }) => (
      <Box
        display="flex"
        h="40"
        w="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
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
            <Link href={`https://open.spotify.com/track/${data.track_id.split('spotify:track:')[1]}`}>{data.title}</Link>
          </Text>
          <Text fontSize="md" color="gray.600">
            {interleave(data.artists.map(({ name, external_urls: { spotify } }) => <Link color="gray.600" href={spotify}>{name}</Link>), <>,{' '}</>)}
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
