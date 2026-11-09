import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".woff2": "font/woff2",
};
export function byteRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header || "");
  if (!match) return null;
  let start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[2] && match[1] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    start >= size ||
    end < start
  )
    return null;
  return { start, end };
}
export function staticHandler(directory) {
  const root = resolve(directory);
  return async (req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const base = resolve(root, "." + pathname);
      if (base !== root && !base.startsWith(root + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const candidates = extname(base)
        ? [base]
        : [base + ".html", resolve(base, "index.html")];
      let file, info;
      for (const candidate of candidates) {
        try {
          const entry = await stat(candidate);
          if (entry.isFile()) {
            file = candidate;
            info = entry;
            break;
          }
        } catch {}
      }
      if (!file) {
        const fallback = resolve(root, "404.html");
        res.writeHead(404, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        });
        if (req.method === "HEAD") res.end();
        else
          createReadStream(fallback)
            .on("error", () => res.end("Not found"))
            .pipe(res);
        return;
      }
      const headers = {
        "Content-Type": mime[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "Accept-Ranges": "bytes",
        "X-Content-Type-Options": "nosniff",
      };
      let range;
      if (req.headers.range) {
        range = byteRange(req.headers.range, info.size);
        if (!range) {
          res.writeHead(416, { ...headers, "Content-Range": `bytes */${info.size}` });
          res.end();
          return;
        }
        headers["Content-Range"] = `bytes ${range.start}-${range.end}/${info.size}`;
      }
      headers["Content-Length"] = range ? range.end - range.start + 1 : info.size;
      res.writeHead(range ? 206 : 200, headers);
      if (req.method === "HEAD") res.end();
      else
        createReadStream(file, range || {})
          .on("error", () => res.destroy())
          .pipe(res);
    } catch {
      res.writeHead(400);
      res.end("Invalid request");
    }
  };
}
