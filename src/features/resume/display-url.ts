/** `https://www.linkedin.com/in/x/` -> `linkedin.com/in/x`, for text meant to be read on paper. */
export function displayUrl(url: string): string {
  const { hostname, pathname } = new URL(url);
  return `${hostname.replace(/^www\./, '')}${pathname.replace(/\/$/, '')}`;
}
