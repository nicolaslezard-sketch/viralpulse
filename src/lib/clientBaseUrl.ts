export function getClientBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // If not set, use relative URLs (same-origin)
  return "";
}

export function apiUrl(path: string) {
  const base = getClientBaseUrl();
  if (!base) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}
