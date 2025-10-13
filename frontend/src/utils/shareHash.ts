// Simple helpers to work with share-hash based deep links

export function getShareHashFromSearch(
  search: string | undefined | null,
): string {
  if (!search) return "";
  const s = search.startsWith("?") ? search.slice(1) : search;
  // For now we treat the entire query as the shareHash (no key=value pairs)
  return s;
}

export function makeAvailabilityPath(shareHash: string): string {
  return `/availability/?${shareHash}`;
}

export function makeResultPath(shareHash: string): string {
  return `/event-result/?${shareHash}`;
}

export function makeAbsolute(urlPath: string): string {
  try {
    return new URL(urlPath, window.location.origin).toString();
  } catch {
    return urlPath;
  }
}
