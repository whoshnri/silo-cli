import { build, emptyDir } from "jsr:@deno/dnt@0.41.2";

await emptyDir("./npm");

await build({
  entryPoints: [
    {
      kind: "bin",
      name: "silo",
      path: "./main.ts",
    },
  ],
  outDir: "./npm",
  shims: {
    // Enable Deno compatibility shim
    deno: true,
  },
  package: {
    name: "@silo/cli",
    version: "0.1.0",
    description: "Command line interface for Silo self-hosted KV cache",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/whoshnri/silo-cli.git",
    },
    bugs: {
      url: "https://github.com/whoshnri/silo-cli/issues",
    },
  },
  postBuild() {
    try {
      Deno.copyFileSync("README.md", "npm/README.md");
    } catch (err) {
      console.warn("Could not copy README.md to npm folder:", (err as Error).message);
    }
    try {
      Deno.copyFileSync("docs.html", "npm/esm/docs.html");
    } catch (err) {
      console.warn("Could not copy docs.html to ESM folder:", (err as Error).message);
    }
    try {
      Deno.copyFileSync("docs.html", "npm/script/docs.html");
    } catch (err) {
      console.warn("Could not copy docs.html to CommonJS/script folder:", (err as Error).message);
    }
  },
});
