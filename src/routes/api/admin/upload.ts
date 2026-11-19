import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string[]> = {
  png: ["image/png"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  gif: ["image/gif"],
  webp: ["image/webp"],
  ico: ["image/x-icon", "image/vnd.microsoft.icon"],
};
const VIDEO_TYPES: Record<string, string[]> = {
  mp4: ["video/mp4"],
  webm: ["video/webm"],
  ogv: ["video/ogg"],
};

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authorization = request.headers.get("authorization");
          const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
          if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

          const supabase = createClient(
            process.env["SUPABASE_URL"] ?? "",
            process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "",
            {
              auth: { persistSession: false, autoRefreshToken: false },
              global: { headers: { Authorization: `Bearer ${token}` } },
            },
          );
          const { data: userData, error: userError } = await supabase.auth.getUser(token);
          if (userError || !userData.user)
            return Response.json({ error: "Unauthorized" }, { status: 401 });

          const { data: role, error: roleError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userData.user.id)
            .eq("role", "admin")
            .maybeSingle();
          if (roleError || !role) return Response.json({ error: "Forbidden" }, { status: 403 });

          const formData = await request.formData();
          const file = formData.get("file");
          if (!(file instanceof File))
            return Response.json({ error: "Missing file" }, { status: 400 });

          const extension = path.extname(file.name).slice(1).toLowerCase();
          const isVideo = extension in VIDEO_TYPES;
          const allowedTypes = isVideo ? VIDEO_TYPES[extension] : IMAGE_TYPES[extension];
          if (!allowedTypes || (file.type && !allowedTypes.includes(file.type)))
            return Response.json({ error: "Only supported image and video files are allowed" }, { status: 415 });
          const maxFileSize = isVideo ? MAX_VIDEO_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
          if (file.size > maxFileSize)
            return Response.json(
              { error: `File is larger than ${isVideo ? "100 MB" : "10 MB"}` },
              { status: 413 },
            );

          const filename = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
          const uploadDirectory = path.resolve(
            process.env["UPLOADS_DIR"] ?? path.join(process.cwd(), "public", "uploads"),
          );
          await mkdir(uploadDirectory, { recursive: true });
          await writeFile(
            path.join(uploadDirectory, filename),
            new Uint8Array(await file.arrayBuffer()),
          );

          return Response.json({ url: `/api/public/uploads/${filename}` });
        } catch (error) {
          console.error("Upload handler error:", error);
          const uploadDir = path.resolve(
            process.env["UPLOADS_DIR"] ?? path.join(process.cwd(), "public", "uploads"),
          );
          return Response.json(
            {
              error: `Local upload failed. Check that ${uploadDir} exists and is writable by the Node.js process. Set UPLOADS_DIR in CPanel environment if needed.`,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
