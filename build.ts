#!/usr/bin/env bun
import { $ } from "bun";

const baseConfig = {
  entrypoints: ["./src/index.ts"],
};


await Bun.build({
  ...baseConfig,
  outdir: "./dist",
  target: "node",
  format: "esm",
  sourcemap: "external",
});

await Bun.build({
  ...baseConfig,
  outdir: "./dist/browser",
  target: "browser",
  format: "esm",
  sourcemap: "external",
});