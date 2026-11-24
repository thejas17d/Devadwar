/**
 * Serves ./out the way GitHub Pages does, for local testing of the static build:
 *   http://localhost:4173/Devadwar/   (dir → index.html, extensionless → .html, unknown → 404.html with status 404)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const base = (process.env.BASE_PATH ?? "/Devadwar").replace(/\/$/, "");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".txt": "text/plain", ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".ico": "image/x-icon", ".mp3": "audio/mpeg" };

const send = (res, file, status = 200) => {
  res.writeHead(status, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (base && url === "/") return res.writeHead(302, { Location: base + "/" }).end();
    if (base && !url.startsWith(base + "/") && url !== base) return send(res, path.join(root, "404.html"), 404);
    const rel = url.slice(base.length) || "/";
    const p = path.join(root, rel);
    if (!p.startsWith(root)) return res.writeHead(400).end();
    if (url === base) return res.writeHead(301, { Location: base + "/" }).end();
    const candidates = [p, path.join(p, "index.html"), p + ".html"];
    const hit = candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
    if (hit) return send(res, hit);
    if (fs.existsSync(p) && fs.statSync(p).isDirectory() && !url.endsWith("/")) return res.writeHead(301, { Location: url + "/" }).end();
    send(res, path.join(root, "404.html"), 404);
  })
  .listen(port, () => console.log(`GitHub Pages preview: http://localhost:${port}${base}/`));
