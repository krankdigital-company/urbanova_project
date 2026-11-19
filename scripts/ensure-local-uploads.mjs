import { mkdir, chmod } from "node:fs/promises";

const uploadsDir = "public/uploads";
await mkdir(uploadsDir, { recursive: true });
try {
  // Set permissions to 0o775 (rwxrwxr-x) so the Node.js application and group can write
  await chmod(uploadsDir, 0o775);
  console.log(`✓ Local uploads directory ready: ${uploadsDir}`);
} catch (e) {
  console.warn(`⚠ Could not set permissions on ${uploadsDir}:`, e.message);
}
