import { z } from "zod";

export const payloadSchema = z.union([
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

export type Payload = z.infer<typeof payloadSchema>;
