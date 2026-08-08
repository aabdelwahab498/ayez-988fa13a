/**
 * A new deploy replaces hashed chunk URLs. Tabs opened against the previous
 * build request chunks that no longer exist and blank-screen. Recover by doing
 * a cache-busting reload, guarded by a short time window to avoid loops.
 */
const RELOAD_KEY = "ayez-stale-chunk-reload-at";
const RELOAD_COOLDOWN_MS = 15_000;

export function isStaleChunkError(error: unknown): boolean {
  const message =
    error instanceof Error ? `${error.message} ${error.name}` : String(error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS|ChunkLoadError/i.test(
    message,
  );
}

/** Returns true when a recovery reload was triggered. */
export function recoverFromStaleChunk(): boolean {
  if (typeof window === "undefined") return false;

  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
  } catch {
    last = 0;
  }

  const now = Date.now();
  if (now - last < RELOAD_COOLDOWN_MS) return false;

  try {
    sessionStorage.setItem(RELOAD_KEY, String(now));
  } catch {
    /* ignore storage failures */
  }

  const url = new URL(window.location.href);
  url.searchParams.set("_v", String(now));
  window.location.replace(url.toString());
  return true;
}

let listenersInstalled = false;

/** Catches Vite's preload failures before they ever reach a React boundary. */
export function installStaleChunkRecovery() {
  if (listenersInstalled || typeof window === "undefined") return;
  listenersInstalled = true;

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    recoverFromStaleChunk();
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isStaleChunkError(event.reason)) recoverFromStaleChunk();
  });
}
