import "dotenv/config";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { Readable } from "node:stream";

const applicationRoot = path.dirname(fileURLToPath(import.meta.url));
const localEnvPath = path.join(applicationRoot, ".env");

if (existsSync(localEnvPath)) {
  process.env.NODE_ENV ??= "production";
}

process.env.UPLOADS_DIR ??= path.join(applicationRoot, "public", "uploads");

const port = Number(process.env.PORT || 3000);
const cpanelServerBundle = path.join(applicationRoot, "server", "app", "server.js");
const serverBundle = existsSync(cpanelServerBundle)
  ? cpanelServerBundle
  : path.join(applicationRoot, "dist", "server", "server.js");
const cpanelClientRoot = path.join(applicationRoot, "client");
const clientRoot = existsSync(cpanelClientRoot)
  ? cpanelClientRoot
  : path.join(applicationRoot, "dist", "client");
const uploadsRoot = path.resolve(process.env.UPLOADS_DIR);
const { default: app } = await import(pathToFileURL(serverBundle).href);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function serveClientFile(urlPath, method, response) {
  const isUpload = urlPath.startsWith("/api/public/uploads/");
  if (
    !isUpload &&
    !urlPath.startsWith("/assets/") &&
    urlPath !== "/favicon.ico" &&
    urlPath !== "/favicon.jpg" &&
    urlPath !== "/robots.txt"
  ) {
    return false;
  }

  const relativePath = decodeURIComponent(urlPath).replace(/^\/+/, "");
  const root = isUpload ? uploadsRoot : clientRoot;
  const fileName = isUpload ? path.basename(relativePath) : relativePath;
  const filePath = path.resolve(root, isUpload ? fileName : fileName);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.statusCode = 400;
    response.end("Bad Request");
    return true;
  }

  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) return false;
    response.statusCode = 200;
    response.setHeader(
      "content-type",
      contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    );
    response.setHeader(
      "cache-control",
      urlPath.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : isUpload
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600",
    );
    response.end(method === "HEAD" ? undefined : await readFile(filePath));
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (nodeRequest, nodeResponse) => {
  try {
    const requestPath = new URL(nodeRequest.url || "/", "http://localhost").pathname;
    if (await serveClientFile(requestPath, nodeRequest.method, nodeResponse)) return;

    const protocol = nodeRequest.headers["x-forwarded-proto"] || "http";
    const host = nodeRequest.headers.host || `127.0.0.1:${port}`;
    const url = `${protocol}://${host}${nodeRequest.url || "/"}`;
    const headers = new Headers();

    for (const [key, value] of Object.entries(nodeRequest.headers)) {
      if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }

    const request = new Request(url, {
      method: nodeRequest.method,
      headers,
      body: ["GET", "HEAD"].includes(nodeRequest.method || "GET")
        ? undefined
        : Readable.toWeb(nodeRequest),
      duplex: "half",
    });
    const response = await app.fetch(request, {}, {});

    nodeResponse.statusCode = response.status;
    response.headers.forEach((value, key) => nodeResponse.setHeader(key, value));
    nodeResponse.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    nodeResponse.statusCode = 500;
    nodeResponse.setHeader("content-type", "text/plain; charset=utf-8");
    nodeResponse.end("Internal Server Error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Content Magic admin listening on port ${port}`);
});
