export function resolveAssetUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  if (/^(?:https?:|data:|blob:)/i.test(rawUrl)) return rawUrl;

  const baseUrl = import.meta.env.BASE_URL;
  const normalizedUrl = rawUrl.replace(/^\/your-repo-name\//, "/");

  if (normalizedUrl.startsWith("/images/") || normalizedUrl.startsWith("/files/")) {
    return `${baseUrl}${normalizedUrl.slice(1)}`;
  }

  if (normalizedUrl.startsWith("/")) {
    return `${baseUrl}${normalizedUrl.slice(1)}`;
  }

  return `${baseUrl}${normalizedUrl}`;
}