import "server-only";

export function isEarlyAccessOpen() {
  return process.env.AGENTCOACH_EARLY_ACCESS === "1";
}
