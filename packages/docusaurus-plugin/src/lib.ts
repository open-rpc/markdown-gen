/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import {
  OpenrpcDocument,
  MethodObject,
  MethodObjectParams,
} from "@open-rpc/meta-schema";

import { promises as fs } from "fs";

import * as path from "path";

type JSONSchema = any;

type RefNode = { $ref: string };

type NoRefs<T> =
  // If T itself is a ref → remove it
  T extends RefNode
    ? never
    : // If T is an array → apply recursively to element type
      T extends (infer U)[]
      ? NoRefs<U>[]
      : // If T is an object → map over its properties
        T extends object
        ? { [K in keyof T]: NoRefs<T[K]> }
        : // Primitives (string, number, etc.) are left as-is
          T;

type DereffedOpenrpcDocument = NoRefs<OpenrpcDocument>;

type DereffedMethodObject = NoRefs<MethodObject>;

type DereffedMethodObjectParams = NoRefs<MethodObjectParams>;

export async function generateDocs2(inputPath: string, outputPath: string) {
  const raw = await fs.readFile(inputPath, "utf8");
  const doc: DereffedOpenrpcDocument = (await parseOpenRPCDocument(
    raw,
  )) as DereffedOpenrpcDocument;
  const outDir = outputPath;
  const methodsDir = path.join(outDir, "methods");
  const schemasDir = path.join(outDir, "schemas");

  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(methodsDir, { recursive: true });
  await fs.mkdir(schemasDir, { recursive: true });

  await fs.writeFile(path.join(outDir, "index.md"), renderIndex(doc), "utf8");

  for (const m of doc.methods) {
    await fs.writeFile(
      path.join(methodsDir, `${m.name}.mdx`),
      renderMethod(m),
      "utf8",
    );
  }
}

export async function generateDocs(inputPath: string, outputPath: string) {
  const raw = await fs.readFile(inputPath, "utf8");
  const doc: DereffedOpenrpcDocument = (await parseOpenRPCDocument(
    raw,
  )) as DereffedOpenrpcDocument;

  const outDir = outputPath;
  const methodsDir = path.join(outDir, "methods");
  const schemasDir = path.join(outDir, "schemas");

  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(methodsDir, { recursive: true });
  await fs.mkdir(schemasDir, { recursive: true });

  await fs.writeFile(path.join(outDir, "index.md"), renderIndex(doc), "utf8");

  for (const m of doc.methods) {
    await fs.writeFile(
      path.join(methodsDir, `${m.name}.mdx`),
      renderMethod(m),
      "utf8",
    );
  }

  const schemas = doc.components?.schemas ?? {};
  for (const [name, schema] of Object.entries(schemas)) {
    await fs.writeFile(
      path.join(schemasDir, `${name.toLowerCase()}.md`),
      renderSchema(name, schema),
      "utf8",
    );
  }

  console.log("Docs generated in ./docs");
}

/* ---------- Renderers ---------- */

function renderIndex(doc: DereffedOpenrpcDocument): string {
  const title = doc.info?.title || "API";
  const version = doc.info?.version || "";
  const desc = doc.info?.description || "";
  const methods = doc.methods || [];
  const schemas = Object.keys(doc.components?.schemas || {});

  const methodsList =
    methods.length === 0
      ? "_No methods defined._"
      : methods
          .map((m) => `- [\`${m.name}\`](./methods/${m.name}.mdx)`)
          .join("\n");

  const schemasList =
    schemas.length === 0
      ? "_No schemas defined._"
      : schemas
          .map((s) => `- [\`${s}\`](./schemas/${s.toLowerCase()}.md)`)
          .join("\n");

  return `---
title: "${title}"
description: "${escapeYaml(desc)}"
sidebar_label: "${title}"
tags:
  - json-rpc
  - openrpc
---

# ${title}

${version ? `Version: \`${version}\`\n` : ""}${desc ? `\n${desc}\n` : ""}

## Methods

${methodsList}

## Schemas

${schemasList}
`;
}

function renderMethod(m: DereffedMethodObject): string {
  const desc = m.description || "";
  const params = m.params || [];
  const result = m.result;

  const paramTable =
    params.length === 0
      ? "_This method does not accept any parameters._"
      : [
          "| Name | Type | Required | Description |",
          "| ---- | ---- | -------- | ----------- |",
          ...params.map((p) => {
            const type = typeFromSchema(p.schema);
            const required = p.required ? "yes" : "no";
            const pDesc = p.description || "";
            return `| ${p.name} | \`${type}\` | ${required} | ${pDesc} |`;
          }),
        ].join("\n");

  const paramSchemaBlock =
    params.length === 0
      ? ""
      : `
### Parameter schema

\`\`\`json
${JSON.stringify(asParamSchemaMap(params), null, 2)}
\`\`\`
`;

  const hasResult = !!(result && result.schema);
  const resultSection = hasResult
    ? (() => {
        const rType = typeFromSchema(result!.schema);
        const rName = result!.name || "result";
        const rDesc = result!.description || "";
        return `## Result

- **Name:** \`${rName}\`
${rDesc ? `- **Description:** ${rDesc}\n` : ""}- **Type:** \`${rType}\`

### Result schema

\`\`\`json
${JSON.stringify(result!.schema, null, 2)}
\`\`\`
`;
      })()
    : `## Result

_This method does not return a result payload._
`;

  const exampleNamed = renderExample(m, params, "named");
  const examplePositional = renderExample(m, params, "positional");

  const positionalSection =
    params.length === 0
      ? ""
      : `
---

### Positional parameters

Parameter order:

${params.map((p, i) => `${i + 1}. \`${p.name}\``).join("\n")}

#### Request

\`\`\`json
${JSON.stringify(examplePositional.request, null, 2)}
\`\`\`

#### Successful response

\`\`\`json
${JSON.stringify(examplePositional.response, null, 2)}
\`\`\`
`;

  return `---
title: "${m.name}"
hide_table_of_contents: true
description: "${escapeYaml(
    desc || `Documentation for JSON-RPC method ${m.name}.`,
  )}"
sidebar_label: "${m.name}"
rpc_method: "${m.name}"
tags:
  - json-rpc
  - openrpc
  - method
---

import {TwoColumnLayout, RequestExample, ResponseExample, TryNow} from '@open-rpc/docusaurus-plugin/components';

<TwoColumnLayout 
  sidebar={
    <>
      <RequestExample 
        title="Named Parameters" 
        code={${JSON.stringify(JSON.stringify(exampleNamed.request, null, 2))}} 
      />
      
      <ResponseExample 
        title="Successful Response" 
        code={${JSON.stringify(JSON.stringify(exampleNamed.response, null, 2))}} 
      />${
        params.length > 0
          ? `
      
      <RequestExample 
        title="Positional Parameters" 
        code={${JSON.stringify(JSON.stringify(examplePositional.request, null, 2))}} 
      />
      
      <ResponseExample 
        title="Successful Response" 
        code={${JSON.stringify(JSON.stringify(examplePositional.response, null, 2))}} 
      />`
          : ""
      }
    </>
  }
>
<TryNow />
# ${m.name}

${desc ? `${desc}\n` : ""}

---

## Method

- **JSON-RPC method name:** \`${m.name}\`
- **JSON-RPC version:** \`2.0\`

## Parameters

${paramTable}
${paramSchemaBlock}
${resultSection}${
    params.length > 0
      ? `

### Positional parameters

Parameter order:

${params.map((p, i) => `${i + 1}. \`${p.name}\``).join("\n")}`
      : ""
  }

---

## Errors

This method may return JSON-RPC standard errors (e.g. \`-32600\`, \`-32601\`, \`-32602\`, \`-32603\`) as well as application-specific errors.

> TODO: Document method-specific error codes and conditions.

</TwoColumnLayout>
`;
}

function renderSchema(name: string, schema: JSONSchema): string {
  const shortDesc = schema?.description || `Schema definition for ${name}.`;

  const isObject = schema.type === "object" && schema.properties;
  const propsTable =
    isObject && schema.properties
      ? (() => {
          const required = new Set<string>(schema.required || []);
          const rows = Object.entries<any>(schema.properties).map(
            ([propName, propSchema]) => {
              const t = typeFromSchema(propSchema);
              const isReq = required.has(propName) ? "yes" : "no";
              const desc = propSchema.description || "";
              return `| ${propName} | \`${t}\` | ${isReq} | ${desc} |`;
            },
          );
          return `
---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
${rows.join("\n")}
`;
        })()
      : "";

  return `---
title: "${name}"
description: "${escapeYaml(shortDesc)}"
sidebar_label: "${name}"
schema_name: "${name}"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ${name}

${schema.description ? `${schema.description}\n` : ""}---

## JSON Schema

\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`
${propsTable}
`;
}

/* ---------- Helpers ---------- */

function asParamSchemaMap(params: DereffedMethodObjectParams) {
  const out: Record<string, any> = {};
  for (const p of params) {
    out[p.name || ""] = {
      description: p.description,
      required: !!p.required,
      schema: p.schema || {},
    };
  }
  return out;
}

function typeFromSchema(schema: JSONSchema | undefined): string {
  if (!schema) return "any";
  if (schema.$ref) return refName(schema.$ref);
  if (schema.type === "array" && schema.items) {
    return `${typeFromSchema(schema.items)}[]`;
  }
  if (schema.type) return String(schema.type);
  if (schema.allOf) return "allOf";
  if (schema.oneOf) return "oneOf";
  if (schema.anyOf) return "anyOf";
  return "any";
}

function refName(ref: string): string {
  const parts = ref.split("/");
  return parts[parts.length - 1] || ref;
}

type ExampleMode = "named" | "positional";

function renderExample(
  m: DereffedMethodObject,
  params: DereffedMethodObjectParams,
  mode: ExampleMode,
) {
  const id = mode === "named" ? 1 : 2;

  let paramsValue: any;
  if (params.length === 0) {
    paramsValue = {};
  } else if (mode === "named") {
    const obj: Record<string, any> = {};
    for (const p of params) {
      obj[p.name] = exampleValueFromSchema(p.schema);
    }
    paramsValue = obj;
  } else {
    paramsValue = params.map((p) => exampleValueFromSchema(p.schema));
  }

  const request = {
    jsonrpc: "2.0",
    method: m.name,
    params: paramsValue,
    id,
  };

  const response = {
    jsonrpc: "2.0",
    result: exampleResultFromMethod(m),
    id,
  };

  return { request, response };
}

function exampleValueFromSchema(schema: JSONSchema | undefined): any {
  if (!schema) return "example";
  if (schema.example !== undefined) return schema.example;

  if (schema.$ref) {
    const name = refName(schema.$ref);
    return { [name.toLowerCase()]: "example" };
  }

  switch (schema.type) {
    case "string":
      return "string";
    case "integer":
    case "number":
      return 1;
    case "boolean":
      return true;
    case "array":
      return [exampleValueFromSchema(schema.items)];
    case "object":
      if (schema.properties) {
        const obj: Record<string, any> = {};
        for (const [key, value] of Object.entries<any>(schema.properties)) {
          obj[key] = exampleValueFromSchema(value);
        }
        return obj;
      }
      return {};
    default:
      return "example";
  }
}

// Leaving this here for now because we don't actually handle the type exactly maybe
function exampleResultFromMethod(m: DereffedMethodObject): any {
  if (!m.result || !m.result.schema) return {};

  const s = m.result.schema as JSONSchema;

  if (s.type === "array" && s.items) {
    return [exampleValueFromSchema(s.items)];
  }

  if (s.$ref) {
    const name = refName(s.$ref).toLowerCase();
    if (name === "pet") {
      return { id: 1, name: "Fluffy", tag: "cat" };
    }
  }

  const val = exampleValueFromSchema(s);
  const t = typeFromSchema(s);
  if (t.endsWith("[]") && !Array.isArray(val)) {
    return [val];
  }
  return val;
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, " ");
}
