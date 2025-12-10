#!/usr/bin/env bun

import { watch } from "fs";
import { $ } from "bun";

async function buildAll() {
  try {
    console.log("🔄 Building markdown-generator...");
    await $`bun run --cwd packages/markdown-generator build.ts`;
    await $`bun run --cwd packages/markdown-generator tsc -p tsconfig.json`;
    
    console.log("🔄 Building docusaurus-plugin...");
    await $`bun run --cwd packages/docusaurus-plugin build.ts`;
    await $`bun run --cwd packages/docusaurus-plugin tsc -p tsconfig.json`;

      // Touch the OpenRPC spec to trigger Docusaurus reload
      console.log("🔄 Triggering Docusaurus reload...");
      await $`touch packages/example-site/execution-apis.json`;

    
    console.log("✅ Build complete");
  } catch (error: any) {
    console.error("❌ Build failed");
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
  }
}

async function buildPluginOnly() {
  try {
    console.log("🔄 Building docusaurus-plugin...");
    await $`bun run --cwd packages/docusaurus-plugin build.ts`;
    await $`bun run --cwd packages/docusaurus-plugin tsc -p tsconfig.json`;
    console.log("✅ Plugin build complete");
  } catch (error: any) {
    console.error("❌ Plugin build failed");
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
  }
}

console.log("👀 Watching for changes...");

watch("packages/markdown-generator/src", { recursive: true }, async (event, filename) => {
  console.log(`📝 ${filename} changed in markdown-generator`);
  await buildAll();
});

watch("packages/docusaurus-plugin/src", { recursive: true }, async (event, filename) => {
  console.log(`📝 ${filename} changed in docusaurus-plugin`);
  await buildPluginOnly();
});

await buildAll();