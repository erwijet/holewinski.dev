import useWebSocket from "react-use-websocket";
import { payloadSchema, Payload } from "./types";
import { useEffect, useRef } from "react";
import {
  Maybe,
  pipe,
  slicePropertyAtDeepKey,
  withSome,
} from "@bryx-inc/ts-utils";
import { P, match } from "ts-pattern";

export type UseCurrentSpotifySongOptions = {
  host: string;
  onUpdate?: (payload: Payload) => void;
  onAck?: () => void;
};

export function useCurrentSpotifySong(options: UseCurrentSpotifySongOptions) {
  const { lastMessage } = useWebSocket(options.host);

  const interval = useRef<Maybe<NodeJS.Timer>>();
  const state = useRef({
    progress: 0,
    lastSyncPayload: null as Maybe<Payload>,
  });

  useEffect(() => {
    interval.current = setInterval(() => {
      withSome(state.current.lastSyncPayload, (lastSyncPayload) => {
        if (
          lastSyncPayload.type == "update" &&
          lastSyncPayload.playing == true
        ) {
          options.onUpdate?.({
            ...slicePropertyAtDeepKey(
              lastSyncPayload,
              "data.progress",
              ++state.current.progress
            ),
          });
        }
      });
    }, 1000);
    return () => void withSome(interval.current, clearInterval);
  }, []);

  useEffect(() => {
    withSome(lastMessage, (lastMessage) =>
      match(pipe(lastMessage.data as string, JSON.parse, payloadSchema.parse))
        .with({ type: "ack" }, () => options.onAck?.())
        .with(
          P.union(
            { type: "update", playing: false },
            { type: "update", paused: true }
          ),
          () => {
            state.current.lastSyncPayload = null;
            state.current.progress = 0;
          }
        )
        .with({ type: "update", playing: true }, (payload) => {
          state.current.lastSyncPayload = payload;
          state.current.progress = payload.data.progress;
        })
    );
  }, [lastMessage]);
}
