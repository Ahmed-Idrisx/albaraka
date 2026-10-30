import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during server render, true in the browser. */
export const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
