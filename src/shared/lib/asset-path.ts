export function assetPath(path: string) {
  const normalized = path && !path.startsWith("/") ? `/${path}` : path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${normalized}`;
}
