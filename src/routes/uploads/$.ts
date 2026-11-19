import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/uploads/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const filename = (params as { _splat?: string })._splat ?? "";
        if (!filename || filename.includes("..") || filename.includes("/")) {
          return new Response("Not found", { status: 404 });
        }
        return Response.redirect(`/api/public/uploads/${encodeURIComponent(filename)}`, 307);
      },
    },
  },
});
