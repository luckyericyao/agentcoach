const launcherPid = process.ppid;

export function fixtureIsOrphaned() {
  if (process.platform === "win32") return false;
  try {
    process.kill(launcherPid, 0);
    return false;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "ESRCH";
  }
}

export function watchFixtureParent(onExit: () => void) {
  if (process.platform === "win32") return;
  const timer = setInterval(() => {
    if (fixtureIsOrphaned()) {
      clearInterval(timer);
      onExit();
    }
  }, 250);
  timer.unref();
}
