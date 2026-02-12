import { z } from "astro/zod";
import { useEffect, useState } from "react";
import { clsx } from "clsx"
import IconPauseUrl from "@/assets/icons/IconPause.svg?url";

export const Player = () => {
  const [song, setSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!song || !isPlaying) return;
      setSong({
        ...song,
        time: { duration: song.time.duration, cursor: song.time.cursor + 500 },
      });
    }, 500);

    return () => {
      clearInterval(interval)
    }
  }, [song, isPlaying])

  useEffect(() => {
    const source = new EventSource("https://spotipub.holewinski.dev/sse");

    function ondata(evt: MessageEvent) {
      const payload = zUpdateSchema.safeParse(JSON.parse(evt.data));

      if (!payload.success) {
        setSong(null);
        return;
      }
      
      setIsPlaying(payload.data.is_playing)

      setSong({
        title: payload.data.item.name,
        artists: payload.data.item.artists.map(a => ({ ...a, href: a.external_urls.spotify })),
        href: payload.data.item.external_urls.spotify,
        image: payload.data.item.album.images
          .toSorted((a, b) => b.height - a.height)
          .at(0)?.url,
        time: {
          cursor: payload.data.progress_ms,
          duration: payload.data.item.duration_ms,
        },
      });
    }

    source.addEventListener("initial", ondata);
    source.addEventListener("update", ondata);

    return () => {
      source.removeEventListener("initial", ondata);
      source.removeEventListener("update", ondata);
    };
  }, []);

  if (!song) return null;

  return (
    <div className="mt-6 rounded-md border-1 border-foreground bg-background p-2 w-full sm:w-[300px] animate-fade-in">
      <div className="flex gap-2">

        <div className="relative aspect-square h-14 w-14">
          {!isPlaying && <object className="absolute translate-x-1/2 -translate-y-1/2 top-1/2 right-1/2 z-10" data={IconPauseUrl} />}
          <img className={clsx("absolute top-0 left-0 aspect-square h-14 w-14 rounded-sm", !isPlaying && "opacity-15")} src={song.image} />
        </div>

        <div className="truncate flex flex-col">
          <span className="text-xs opacity-80">Listening to</span>

          <a
            href={song.href}
            className="text-sm decoration-dashed hover:underline"
          >
            {song.title}
          </a>

          <div className="flex gap-2 [&>*:not(:last-child):after]:content-[',']">
            {song.artists.map(a => (
              <a
                href={a.href}
                className="text-xs decoration-dashed hover:underline"
              >
                {a.name}
              </a>
            ))}
          </div>
        </div>

      </div>

        <div className="h-1 w-full rounded-full mt-2 border-1 border-foreground">
          <div
            className="h-0.5 rounded-full bg-foreground transition-all ease-linear duration-300"
            style={{
              width: `${(song.time.cursor / song.time.duration) * 100}%`,
            }}
          ></div>
        </div>
    </div>
  );
};

type Song = {
  href: string;
  title: string;
  artists: {
    name: string;
    href: string;
  }[];
  image?: string;
  time: {
    cursor: number;
    duration: number;
  };
};

const zUpdateSchema = z.object({
  is_playing: z.boolean(),
  progress_ms: z.number(),
  item: z.object({
    duration_ms: z.number(),
    name: z.string(),
    href: z.string(),
    external_urls: z.object({ spotify: z.string() }),
    album: z.object({
      images: z
        .object({
          height: z.number(),
          width: z.number(),
          url: z.string(),
        })
        .array(),
    }),
    artists: z
      .object({
        name: z.string(),
        external_urls: z.object({ spotify: z.string() })
      })
      .array(),
  }),
});
