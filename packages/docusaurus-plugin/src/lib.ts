/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseOpenRPCDocument } from "@open-rpc/schema-utils-js";
import type { Edits, SchemaEdits } from "@open-rpc/markdown-generator";
import {
  identityEdits,
  identitySchemaEdits,
  renderMethodsToMarkdown,
  renderIndex,
} from "@open-rpc/markdown-generator";
import type {
  DereffedMethodObject,
  DereffedMethodObjectParams,
  DereffedOpenrpcDocument,
} from "@open-rpc/markdown-generator";
import { promises as fs } from "fs";
import * as path from "path";
import {
  OpenRPCMdContent,
  markdownEdits,
  markdownSchemaEdits,
} from "@open-rpc/markdown-generator";
import { MethodObjectParamStructure } from "@open-rpc/meta-schema";

type JSONSchema = any;

const reactComponent: string = `import {TwoColumnLayout, InteractiveRequest, ResponseExample} from '@open-rpc/docusaurus-plugin/components';\nimport { useState } from 'react';`;
const methodEdits: Edits = { ...identityEdits, ...markdownEdits };
const schemaEdits: SchemaEdits = {
  ...identitySchemaEdits,
  ...markdownSchemaEdits,
};

methodEdits.editMethod = (content, method) => {
  const m = method as DereffedMethodObject;
  const params = (m.params || []) as DereffedMethodObjectParams;
  const exampleNamed = renderExample(
    m,
    params,
    getExampleMode(m.paramStructure),
  );

  return [
    {
      type: "mdxjsEsm",
      value: `${reactComponent}`,
    },
    {
      type: "mdxJsxFlowElement",
      name: "TwoColumnLayout",
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "sidebar",
          value: {
            type: "mdxJsxAttributeValueExpression",
            value: `<InteractiveRequest request={${JSON.stringify(JSON.stringify(exampleNamed?.request, null, 2))}} />`,
          },
        },
      ],
      children: [...content],
    },
  ] as OpenRPCMdContent[];
};

export async function generateDocs(inputPath: string, outputPath: string) {
  const raw = await fs.readFile(inputPath, "utf8");
  const doc: DereffedOpenrpcDocument = (await parseOpenRPCDocument(
    raw,
  )) as DereffedOpenrpcDocument;

  const methods = await renderMethodsToMarkdown(doc, methodEdits, schemaEdits);

  const outDir = outputPath;
  const methodsDir = path.join(outDir, "methods");
  const schemasDir = path.join(outDir, "schemas");

  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(methodsDir, { recursive: true });
  await fs.mkdir(schemasDir, { recursive: true });

  for (const m of methods) {
    await fs.writeFile(
      path.join(methodsDir, `${m.methodName}.mdx`),
      m.markdown,
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(outDir, "index.md"),
    renderIndex(doc, "mdx"),
    "utf8",
  );
}

/* ---------- Renderers ---------- */

/* ---------- Helpers ---------- */

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

function getExampleMode(
  paramStructure?: MethodObjectParamStructure,
): ExampleMode {
  if (!paramStructure) return "positional";
  return paramStructure === "by-name" ? "named" : "positional";
}

function renderExample(
  m: DereffedMethodObject,
  params: DereffedMethodObjectParams,
  mode: ExampleMode,
) {
  const id = 1;

  let paramsValue: any;
  if (params.length === 0) {
    paramsValue = [];
  } else if (mode === "named") {
    const obj: Record<string, any> = {};
    for (const p of params) {
      obj[p.name] = exampleValueFromSchema(p.schema);
    }
    paramsValue = obj;
  } else {
    paramsValue = params.map((p) => exampleValueFromSchema(p.schema));
  }
  if (m.examples && m.examples.length > 0) {
    paramsValue = m.examples[0].params.map((p) => p.value) ?? [];
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

  // Handle oneOf, anyOf, allOf - pick the first option
  if (schema.oneOf && Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return exampleValueFromSchema(schema.oneOf[0]);
  }
  if (schema.anyOf && Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return exampleValueFromSchema(schema.anyOf[0]);
  }
  if (schema.allOf && Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    return exampleValueFromSchema(schema.allOf[0]);
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
