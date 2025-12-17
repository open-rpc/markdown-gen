#!/usr/bin/env bun
import { $ } from "bun";

const isWatch = process.argv.includes("--watch");

const baseConfig = {
  entrypoints: ["./src/index.ts", "./src/cli.ts"],
};


await Bun.build({
  ...baseConfig,
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
  packages: "external",
});

await Bun.build({
  ...baseConfig,
  outdir: "./dist/browser",
  target: "browser",
  format: "esm",
  sourcemap: "external",
  packages: "external",
});

if (isWatch) {
  console.log("👀 Watching for changes...");
  const watcher = require("fs").watch("./src", { recursive: true }, async () => {
    console.log("🔄 Rebuilding...");
    await Bun.build({
      ...baseConfig,
      outdir: "./dist",
      target: "node",
      format: "esm",
      packages: "external",
      sourcemap: "external",
    });

    await Bun.build({
      ...baseConfig,
      outdir: "./dist/browser",
      target: "browser",
      format: "esm",
      sourcemap: "external",
      packages: "external",
    });
    console.log("✅ Build complete");
  });
}