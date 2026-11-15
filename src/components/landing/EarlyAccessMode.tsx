"use client";

import { createContext, useContext, type ReactNode } from "react";

const EarlyAccessContext = createContext(false);

export function EarlyAccessMode({ open, children }: { open: boolean; children: ReactNode }) {
  return <EarlyAccessContext.Provider value={open}>{children}</EarlyAccessContext.Provider>;
}

export function useEarlyAccessMode() {
  return useContext(EarlyAccessContext);
}
