import { type Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

const JSON_PATH = path.resolve("src/data/portfolio.json");
const BLOG_DIR = path.resolve("src/data/blog");

export function portfolioApi(): Plugin {
  return {
    name: "portfolio-api",
    configureServer(server) {
      // ── Blog API ──────────────────────────────────────────────────
      server.middlewares.use("/api/blog", (req, res) => {
        res.setHeader("Content-Type", "application/json");

        if (!fs.existsSync(BLOG_DIR)) {
          fs.mkdirSync(BLOG_DIR, { recursive: true });
        }

        if (req.method === "GET") {
          try {
            const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));
            const posts = files.map((f) =>
              JSON.parse(fs.readFileSync(path.join(BLOG_DIR, f), "utf-8"))
            );
            res.statusCode = 200;
            res.end(JSON.stringify(posts));
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to read blog posts" }));
          }
          return;
        }

        if (req.method === "PUT") {
          let body = "";
          req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
          req.on("end", () => {
            try {
              const incoming: Array<{ slug: string }> = JSON.parse(body);
              if (!Array.isArray(incoming)) throw new Error("Expected array");

              // Slugs already on disk
              const existing = fs.readdirSync(BLOG_DIR)
                .filter((f) => f.endsWith(".json"))
                .map((f) => f.replace(/\.json$/, ""));

              const incomingSlugs = new Set(incoming.map((p) => p.slug));

              // Remove files no longer in the array
              for (const slug of existing) {
                if (!incomingSlugs.has(slug)) {
                  fs.unlinkSync(path.join(BLOG_DIR, `${slug}.json`));
                }
              }

              // Write / overwrite each post
              for (const post of incoming) {
                if (!post.slug) continue;
                fs.writeFileSync(
                  path.join(BLOG_DIR, `${post.slug}.json`),
                  JSON.stringify(post, null, 2) + "\n",
                  "utf-8"
                );
              }

              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid data" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });

      // ── Portfolio API ─────────────────────────────────────────────
      server.middlewares.use("/api/portfolio", (req, res) => {
        // CORS for dev
        res.setHeader("Content-Type", "application/json");

        if (req.method === "GET") {
          try {
            const raw = fs.readFileSync(JSON_PATH, "utf-8");
            res.statusCode = 200;
            res.end(raw);
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to read portfolio data" }));
          }
          return;
        }

        if (req.method === "PUT") {
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            try {
              // Validate JSON parses correctly
              const parsed = JSON.parse(body);
              // Write pretty-printed JSON back to the file
              fs.writeFileSync(JSON_PATH, JSON.stringify(parsed, null, 2) + "\n", "utf-8");
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: "Method not allowed" }));
      });
    },
  };
}
