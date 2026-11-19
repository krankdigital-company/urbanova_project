import { spawn } from "node:child_process";

const port = 3100;
const routes = [
  "/",
  "/shop",
  "/collections",
  "/lookbook",
  "/about",
  "/contact",
  "/checkout",
  "/account",
  "/auth",
  "/track",
  "/admin",
];

const server = spawn(process.execPath, ["cpanel-server.mjs"], {
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    if (!response.ok) throw new Error(`${route} returned HTTP ${response.status}`);
    console.log(`OK ${route}`);
  }
} finally {
  server.kill();
}
