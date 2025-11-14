#!/usr/bin/env bun
import { $ } from "bun";

// Build plugin entry only
// Components are exported directly from src/ and transpiled by Docusaurus
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
  external: ["@docusaurus/*", "react", "react-dom"],
});
