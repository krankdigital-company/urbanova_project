import { readFile } from "node:fs/promises";
import path from "node:path";
import { createFileRoute } from "@tanstack/react-router";

const MIME_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
};

export const Route = createFileRoute("/api/public/uploads/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const relativePath = (params as { _splat?: string })._splat ?? "";
        if (
          !relativePath ||
          relativePath.includes("..") ||
          path.basename(relativePath) !== relativePath
        ) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const uploadDirectory = path.resolve(
            process.env["UPLOADS_DIR"] ?? path.join(process.cwd(), "public", "uploads"),
          );
          const file = await readFile(path.join(uploadDirectory, relativePath));
          const extension = path.extname(relativePath).toLowerCase();
          return new Response(file, {
            headers: {
              "content-type": MIME_TYPES[extension] ?? "application/octet-stream",
              "cache-control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
