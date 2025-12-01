#!/usr/bin/env bun
import { $ } from "bun";
import {watch} from "fs";
const isWatch = process.argv.includes("--watch");

const baseConfig = {
  entrypoints: ["./src/index.ts"],
};

async function buildPlugin() {
  await Bun.build({
    ...baseConfig,
    outdir: "./dist",
    target: "node",
    format: "esm",
    sourcemap: "external",
    external: ["@docusaurus/*", "react", "react-dom"],
  });
}

await buildPlugin();

if (isWatch) {
  console.log("👀 Watching for changes...");
  watch("./src", { recursive: true }, async () => {
    console.log("🔄 Rebuilding...");
    await buildPlugin();
    console.log("✅ Build complete");
  });

  watch("../markdown-generator/dist", { recursive: true }, async () => {
    console.log("🔄 Markdown-generator changed, rebuilding plugin...");
    await buildPlugin();
    console.log("✅ Plugin build complete");
  });
}