// Minimal zero-dependency static file server for the exported site (`out/`).
// Used by Playwright's `webServer` and by CI to run e2e against the real static build,
// without pulling in an extra dependency just to serve files.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function resolveFile(pathname) {
  // Strip query/hash and prevent path traversal outside the root.
  const cleanPath = decodeURIComponent(pathname.split("?")[0].split("#")[0]);
  const candidate = normalize(join(root, cleanPath));
  if (!candidate.startsWith(root)) {
    return null;
  }

  const candidates = [];
  if (cleanPath.endsWith("/")) {
    candidates.push(join(candidate, "index.html"));
  } else {
    candidates.push(candidate, `${candidate}.html`, join(candidate, "index.html"));
  }

  for (const file of candidates) {
    try {
      const info = await stat(file);
      if (info.isFile()) {
        return file;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const file = (await resolveFile(req.url ?? "/")) ?? join(root, "404.html");

  try {
    const body = await readFile(file);
    const type = contentTypes[extname(file)] ?? "application/octet-stream";
    res.writeHead(file.endsWith("404.html") ? 404 : 200, { "Content-Type": type });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}`);
});
