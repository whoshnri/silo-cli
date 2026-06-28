import { dim } from "./branding.ts";

const openDocs = () => {
  // Resolve docs.html relative to this file's location (cli/docs.html)
  const docsPath = new URL("../docs.html", import.meta.url).pathname;
  const html = Deno.readTextFileSync(docsPath);

  if (typeof Deno.serve === "function") {
    // Standard Deno path
    const server = Deno.serve({ port: 0, onListen({ port }) {
      const url = `http://localhost:${port}`;
      console.log(dim(`\n  Serving docs at ${url}\n`));

      const cmd = Deno.build.os === "darwin"
        ? new Deno.Command("open", { args: [url] })
        : new Deno.Command("xdg-open", { args: [url] });

      cmd.spawn();
    }}, () => {
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    });

    // Keep alive until Ctrl+C
    Deno.addSignalListener("SIGINT", () => {
      server.shutdown();
      Deno.exit(0);
    });
  } else {
    // Node.js fallback using native http/child_process
    // We dynamically load node modules to remain compatible
    Promise.all([import("node:http"), import("node:child_process")]).then(
      ([{ createServer }, { exec }]) => {
        const server = createServer((_req, res) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html);
        });

        server.listen(0, () => {
          const address = server.address();
          const port = typeof address === "string" ? 0 : address?.port;
          const url = `http://localhost:${port}`;
          console.log(dim(`\n  Serving docs at ${url}\n`));

          const command = process.platform === "darwin"
            ? `open ${url}`
            : process.platform === "win32"
            ? `start ${url}`
            : `xdg-open ${url}`;
          
          exec(command);
        });

        process.on("SIGINT", () => {
          server.close();
          process.exit(0);
        });
      }
    ).catch((err) => {
      console.error("Failed to start documentation server under Node.js:", err);
    });
  }
};

export { openDocs };
