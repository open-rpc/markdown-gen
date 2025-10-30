#!/usr/bin/env bun

import examples from "@open-rpc/examples";

import {
  generateMarkdownFromOpenRPC,
  type OpenRPCDocument,
} from "../src/index";

type ExampleName = keyof typeof examples;

function isExampleName(value: string): value is ExampleName {
  return value in examples;
}

async function main() {
  const request = process.argv[2] ?? "petstore";

  if (!isExampleName(request)) {
    console.error(
      `Unknown example "${request}". Available options: ${Object.keys(examples).join(", ")}`,
    );
    process.exitCode = 1;
    return;
  }

  const document = examples[request] as OpenRPCDocument;
  const markdown = await generateMarkdownFromOpenRPC(document);

  const outputPath = process.env.OUTPUT;
  if (outputPath) {
    await Bun.write(outputPath, markdown);
    console.error(`Wrote ${request} markdown to ${outputPath}`);
  } else {
    console.log(markdown);
  }
}

void main();
