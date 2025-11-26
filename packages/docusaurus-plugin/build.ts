#!/usr/bin/env bun
import { $, Glob } from "bun";
import {watch} from "fs";
import { mkdir, cp } from "fs/promises";

const isWatch = process.argv.includes("--watch");
const isProduction = process.env.NODE_ENV === 'production';


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
    packages: "external",  
    external: ["@docusaurus/*", "react", "react-dom"],
  });

}
async function buildComponents() {
  console.log(`isProduction env: ${isProduction} ${process.env.NODE_ENV}`);
  // Build components - mark CSS as external so webpack handles it
  await Bun.build({
    entrypoints: ["./src/components.ts"],
    outdir: "./dist",
    target: "node",
    format: "esm",
    splitting: true,
    minify: true,  
    external: ["@docusaurus/*", "react", "react-dom"],
    jsx: {
      runtime: 'automatic',
      development: !isProduction,
      importSource: 'react'
    }
  });
  
  // Copy CSS files preserving structure
  const glob = new Glob("**/*.css");
   for await (const file of glob.scan("./src/components")) {
   const dest = `./dist/components/${file}`;
   await mkdir(dest.substring(0, dest.lastIndexOf("/")), { recursive: true });
   await cp(`./src/components/${file}`, dest);
  }
}

await buildPlugin();
await buildComponents();

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