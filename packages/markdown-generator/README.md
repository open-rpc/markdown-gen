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

### `renderMethodsToMarkdown(document, schemaEdits, edits)`

Renders all methods from an OpenRPC document to markdown strings. Returns `Promise<Array<{ methodName: string; markdown: string }>>`.

### `renderDocumentToMarkdownFiles(methodsDir, document, schemaEdits, edits, markdownType)`

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

Hooks for customizing method, parameter, result, error, and example output:

```typescript
interface Edits {
  // Wrap the entire method output (including frontmatter)
  editMethodParent: (
    content: RootContent[] | OpenRPCMdContent[],
    method: DereffedMethodObject
  ) => RootContent[] | OpenRPCMdContent[];

  // Wrap the method content (excluding frontmatter)
  editMethod: (
    content: (OpenRPCMdContent | RootContent)[],
    method: DereffedMethodObject
  ) => (OpenRPCMdContent | RootContent)[];

  // Wrap the parameters section
  editMethodParamsParent: (
    content: OpenRPCMdContent[],
    methodParams: DereffedMethodObjectParams
  ) => OpenRPCMdContent[];

  // Customize individual parameters
  editMethodParam: (
    content: OpenRPCMdContent[],
    methodParam: DereffedMethodObjectParam
  ) => OpenRPCMdContent[];

  // Customize result rendering
  editMethodResult: (
    content: OpenRPCMdContent[],
    methodResult: DereffedMethodObjectResult | undefined
  ) => OpenRPCMdContent[];

  // Wrap the result section
  editMethodResultParent: (
    content: OpenRPCMdContent[],
    methodResult: DereffedMethodObjectResult | undefined
  ) => OpenRPCMdContent[];

  // Wrap the errors section
  editMethodErrorsParent: (
    content: OpenRPCMdContent[],
    errors: DereffedMethodObjectErrorsWithGroup
  ) => OpenRPCMdContent[];

  // Customize individual error rendering
  editMethodError: (
    content: OpenRPCMdContent[],
    error: DereffedMethodObjectErrorWithGroup
  ) => OpenRPCMdContent[];

  // Wrap the examples section
  editMethodExampleParent: (
    content: OpenRPCMdContent[],
    examples: DereffedMethodObjectExamples
  ) => OpenRPCMdContent[];

  // Customize individual example rendering
  editMethodExample: (
    content: OpenRPCMdContent[],
    example: DereffedMethodObjectExample
  ) => OpenRPCMdContent[];
}
```

### The `SchemaEdits` Interface

Hooks for customizing JSON Schema type rendering:

```typescript
interface SchemaEdits {
  // Customize object schema rendering
  editSchemaObject: (
    content: OpenRPCMdContent[],
    schema: JSONSchema
  ) => OpenRPCMdContent[];

  // Customize boolean schema rendering
  editSchemaBoolean: (
    content: OpenRPCMdContent[],
    schema: JSONSchema
  ) => OpenRPCMdContent[];

  // Customize null schema rendering
  editSchemaNull: (content: OpenRPCMdContent[]) => OpenRPCMdContent[];

  // Customize primitive type rendering (string, number, integer, boolean, null)
  editSchemaPrimitive: (
    content: OpenRPCMdContent[],
    schema: JSONSchema
  ) => OpenRPCMdContent[];

  // Customize individual oneOf/anyOf/allOf option rendering
  editSchemaOfType: (
    content: OpenRPCMdContent[],
    schema: JSONSchema
  ) => OpenRPCMdContent[];

  // Customize the container for oneOf/anyOf/allOf schemas
  editSchemaOfTypes: (
    content: OpenRPCMdContent[],
    schemas: JSONSchema[]
  ) => OpenRPCMdContent[];
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
  editSchemaPrimitive: (content, schema) => {
    // Custom primitive schema rendering (string, number, etc.)
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

// Rendering functions and identity edits
export {
  renderMethod,
  identityEdits,
  identitySchemaEdits,
  markdownEdits,
  markdownSchemaEdits,
} from "./schema";
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
