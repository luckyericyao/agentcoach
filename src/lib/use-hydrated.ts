import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const browserSnapshot = () => true;
const initialSnapshot = () => false;

// Keep the server and initial hydration render in agreement.
export function useHydrated() {
  return useSyncExternalStore(subscribe, browserSnapshot, initialSnapshot);
}
