#!/usr/bin/env bun
/* eslint-disable no-console */
import { parseArgs } from "node:util";
import path from "node:path";
import { renderDocumentToMarkdownFiles } from "./lib";
import {
  identityEdits,
  identitySchemaEdits,
  markdownSchemaEdits,
  markdownEdits,
} from "./schema";
import type { Edits, SchemaEdits } from "./type";

const HELP = `
Usage: openrpc-md <openrpc.json> [options]

Generate markdown documentation from an OpenRPC document.

Arguments:
  <openrpc.json>         Path to the OpenRPC document (required)

Options:
  -m, --methodDir <dir>  Output directory for generated .mdx files (default: ".")
  -c, --custom <file>    Path to .js file exporting edits/schemaEdits
  -h, --help             Show this help message
  -t, --markdownType <type>  Type of markdown to generate (default: "mdx")
`;

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      methodDir: { type: "string", short: "m", default: "." },
      custom: { type: "string", short: "c" },
      help: { type: "boolean", short: "h", default: false },
      markdownType: { type: "string", short: "t", default: "mdx" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(HELP);
    process.exit(0);
  }

  const [documentPath] = positionals;
  const markdownType = values.markdownType as "mdx" | "md";
  if (!documentPath) {
    console.error("Error: OpenRPC document path is required.\n");
    console.log(HELP);
    process.exit(1);
  }

  // Load the OpenRPC document
  const resolvedDocPath = path.resolve(documentPath);
  const file = Bun.file(resolvedDocPath);
  const document = await file.json();

  let edits: Edits = identityEdits;
  let schemaEdits: SchemaEdits = identitySchemaEdits;

  // if markdownType is md, use markdownSchemaEdits and markdownEdits
  if (markdownType === "md") {
    schemaEdits = markdownSchemaEdits;
    edits = markdownEdits;
  }
  // Load custom edits if provided

  if (values.custom) {
    const customPath = path.resolve(values.custom);
    const customModule = await import(customPath);
    if (customModule.edits) edits = customModule.edits;
    if (customModule.schemaEdits) schemaEdits = customModule.schemaEdits;
  }

  // Resolve output directory
  const methodDir = path.resolve(values.methodDir!);

  // Generate markdown files
  await renderDocumentToMarkdownFiles(
    methodDir,
    document,
    schemaEdits,
    edits,
    markdownType,
  );

  console.log(`Generated markdown files in ${methodDir}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
