// Helpers to work with share-hash links

export function getShareHashFromSearch(
  search: string | undefined | null,
): string {
  if (!search) return "";
  const s = search.startsWith("?") ? search.slice(1) : search;
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
