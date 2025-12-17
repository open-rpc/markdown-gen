# @open-rpc/markdown-generator

Generate markdown documentation from [OpenRPC](https://open-rpc.org) specifications. Outputs MDX or Markdown files with full support for JSON Schema rendering, examples, and errors.

## Table of Contents

- [Installation](#installation)
- [Programmatic API](#programmatic-api)
- [CLI Usage](#cli-usage)
- [Custom Output with Edits](#custom-output-with-edits)
- [Development](#development)

## Installation

```bash
npm install @open-rpc/markdown-generator
```

## Programmatic API

### `renderMethodsToMarkdown(document, edits, schemaEdits)`

Renders all methods from an OpenRPC document to markdown strings. Returns `Promise<Array<{ methodName: string; markdown: string }>>`.

### `renderDocumentToMarkdownFiles(methodsDir, document, edits, schemaEdits, markdownType)`

Writes markdown files directly to disk for each method, plus an `index.md`. The `markdownType` parameter controls whether output is `"mdx"` or `"md"`.

### `renderIndex(doc, markdownType)`

Generates an index markdown string listing all methods with links. Returns the markdown as a string.

### `identityEdits` / `identitySchemaEdits`

Default edit functions that pass content through unchanged. Use these as a starting point when creating custom edits.

## CLI Usage

The package provides an `openrpc-md` CLI for generating documentation from the command line.

```bash
openrpc-md <openrpc.json> [options]
```

### Options

| Option                  | Short | Default | Description                                            |
| ----------------------- | ----- | ------- | ------------------------------------------------------ |
| `--methodDir <dir>`     | `-m`  | `.`     | Output directory for generated files                   |
| `--custom <file>`       | `-c`  | -       | Path to JS file exporting `edits` and/or `schemaEdits` |
| `--markdownType <type>` | `-t`  | `mdx`   | Output format: `mdx` or `md`                           |
| `--help`                | `-h`  | -       | Show help message                                      |

### Examples

```bash
# Generate MDX files in current directory
openrpc-md ./openrpc.json

# Generate MD files in a specific directory
openrpc-md ./openrpc.json -m ./docs/api -t md

# Use custom edits for output customization
openrpc-md ./openrpc.json -c ./my-edits.js -m ./docs
```

## Custom Output with Edits

The generator uses [mdast](https://github.com/syntax-tree/mdast) (Markdown Abstract Syntax Tree) internally. The `Edits` and `SchemaEdits` interfaces let you wrap or transform the mdast nodes before they're serialized to markdown.

Use this for:

- Wrapping content in custom React components (for MDX)
- Adding custom styling or layout
- Injecting additional content
- Building documentation plugins

### The `Edits` Interface

Hooks for customizing method, parameter, and result output:

```typescript
interface Edits {
  // Wrap the entire method content
  editMethod?: (
    content: (OpenRPCMdContent | RootContent)[],
    method: DereffedMethodObject
  ) => (OpenRPCMdContent | RootContent)[];

  // Wrap the parameters section
  editMethodParamsParent?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParams: DereffedMethodObjectParams
  ) => OpenRPCMdContent[];

  // Customize individual parameters
  editMethodParam?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParam: DereffedMethodObjectParam
  ) => (RootContent | MdxJsxFlowElement)[];

  // Customize parameter schema rendering
  editMethodParamSchema?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParamSchema: DereffedMethodObjectParamSchema,
    methodParam: DereffedMethodObjectParam
  ) => (RootContent | MdxJsxFlowElement)[];

  // Customize result rendering
  editMethodResult?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResult: DereffedMethodObjectResult
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodResultParent?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResult: DereffedMethodObjectResult
  ) => (RootContent | MdxJsxFlowElement)[];

  // Customize result schema rendering
  editMethodResultSchema?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResultSchema: DereffedMethodObjectResultSchema,
    methodResult: DereffedMethodObjectResult
  ) => (RootContent | MdxJsxFlowElement)[];
}
```

### The `SchemaEdits` Interface

Hooks for customizing JSON Schema type rendering:

```typescript
interface SchemaEdits {
  editSchemaNumber?: (
    content: (RootContent | MdxJsxFlowElement)[],
    schemaNumber: number
  ) => (RootContent | MdxJsxFlowElement)[];

  editSchemaString?: (
    content: (RootContent | MdxJsxFlowElement)[],
    text: string
  ) => (RootContent | MdxJsxFlowElement)[];

  editSchemaAnyOf?: (
    content: (RootContent | MdxJsxFlowElement)[],
    anyOf: JSONSchema[]
  ) => (RootContent | MdxJsxFlowElement)[];

  editSchemaOneOf?: (
    content: (RootContent | MdxJsxFlowElement)[],
    oneOf: JSONSchema[]
  ) => (RootContent | MdxJsxFlowElement)[];

  editSchemaAllOf?: (
    content: (RootContent | MdxJsxFlowElement)[],
    allOf: JSONSchema[]
  ) => (RootContent | MdxJsxFlowElement)[];
}
```

### Identity Edits (Default)

Start with identity edits and override only what you need:

```typescript
import {
  identityEdits,
  identitySchemaEdits,
} from "@open-rpc/markdown-generator";

// Identity edits pass content through unchanged
const myEdits = {
  ...identityEdits,
  editMethod: (content, method) => {
    // Wrap in a custom component
    return [
      {
        type: "mdxJsxFlowElement",
        name: "MyWrapper",
        attributes: [],
        children: content,
      },
    ];
  },
};
```

### Example: Custom Edits File for CLI

Create a JS file to use with the `-c` option:

```javascript
// my-edits.js
export const edits = {
  editMethod: (content, method) => {
    // Add a custom React component wrapper
    return [
      {
        type: "mdxjsEsm",
        value: `import { MethodWrapper } from './components';`,
      },
      {
        type: "mdxJsxFlowElement",
        name: "MethodWrapper",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "methodName",
            value: method.name,
          },
        ],
        children: content,
      },
    ];
  },
};

export const schemaEdits = {
  editSchemaString: (content, text) => {
    // Custom string schema rendering
    return content;
  },
};
```

Then use it:

```bash
openrpc-md ./openrpc.json -c ./my-edits.js -m ./docs
```

### Real-World Example: Docusaurus Plugin

See `packages/docusaurus-plugin/src/lib.ts` for a complete example that wraps methods in a two-column layout with an interactive request panel.

## Exported Types

```typescript
// Core types
export type { Edits, SchemaEdits } from "./type";

// Dereferenced OpenRPC types (no $ref nodes)
export type {
  DereffedOpenrpcDocument,
  DereffedMethodObject,
  DereffedMethodObjectParams,
  NoRefs,
} from "./type";

// mdast content type
export type { OpenRPCMdContent } from "./type";
```

## Development

This project uses [Bun](https://bun.sh) for development.

### Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### Setup & Development

```bash
# From the monorepo root
bun install

# Watch mode for development (from root)
bun watch
```

The `packages/example-site` provides a Docusaurus site for testing generator output—run `bun start` from that directory to preview changes.

## Related Packages

- [`@open-rpc/docusaurus-plugin`](../docusaurus-plugin) - Docusaurus integration with interactive components
- [`packages/example-site`](../example-site) - Example Docusaurus site

## License

Apache 2.0
