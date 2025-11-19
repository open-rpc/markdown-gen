import type { Content, PhrasingContent } from "mdast";
import traverseModule from "@json-schema-tools/traverse";

import { renderArray } from "./array";
import { renderBoolean } from "./boolean";
import {
  buildBaseSummary,
  buildCommonBlocks,
  buildGenericConstraintBlocks,
} from "./base";
import { renderNumber } from "./number";
import { renderObject } from "./object";
import { renderString } from "./string";
import type {
  JsonSchema,
  JsonSchemaType,
  SchemaRenderContext,
  SchemaRenderResult,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import { renderUnknown } from "./unknown";

type InternalRenderer = (
  schema: JsonSchema,
  context: SchemaRenderContext,
  path: string,
  helpers: SchemaRendererHelpers,
) => TypeRenderResult;

const traverse: typeof traverseModule =
  typeof (traverseModule as unknown as { default?: unknown }).default ===
  "function"
    ? ((traverseModule as unknown as { default: typeof traverseModule })
        .default)
    : (traverseModule as unknown as typeof traverseModule);

const RENDERERS: Partial<Record<JsonSchemaType, InternalRenderer>> = {
  object: (schema, context, path, helpers) =>
    renderObject(schema, context, path, helpers),
  array: (schema, context, path, helpers) =>
    renderArray(schema, context, path, helpers),
  string: (schema, context, path, helpers) =>
    renderString(schema, context, path, helpers),
  number: (schema, context, path, helpers) =>
    renderNumber(schema, context, path, helpers, "number"),
  integer: (schema, context, path, helpers) =>
    renderNumber(schema, context, path, helpers, "integer"),
  boolean: (schema, context, path, helpers) =>
    renderBoolean(schema, context, path, helpers),
  null: (schema, context, path, helpers) =>
    renderUnknown(schema, context, path, helpers, "must be null"),
};

const EMPTY_HELPERS: SchemaRendererHelpers = {
  getResult: () => undefined,
  getContext: () => undefined,
};

export function renderSchema(
  schema: JsonSchema | undefined,
  context: SchemaRenderContext,
): SchemaRenderResult {
  if (!schema || typeof schema !== "object") {
    const baseSummary = buildBaseSummary({}, context, undefined);
    const details = renderUnknown(
      schema,
      context,
      "$",
      EMPTY_HELPERS,
      schema === false ? "always invalid" : undefined,
    );
    return combineResults({}, baseSummary, details);
  }

  const resultsByPath = new Map<string, SchemaRenderResult>();
  const contextByPath = new Map<string, SchemaRenderContext>();
  contextByPath.set("$", context);

  const helpers: SchemaRendererHelpers = {
    getResult: (path) => resultsByPath.get(path),
    getContext: (path) => contextByPath.get(path),
  };

  traverse(schema, (current, isCycle, path) => {
    const normalizedPath = normalizePath(path);
    const parentPath = parentSchemaPath(normalizedPath);
    const parentContext = parentPath ? contextByPath.get(parentPath) : undefined;
    const currentContext = ensureContextForPath(
      normalizedPath,
      contextByPath,
      parentContext,
    );

    const jsonSchema =
      typeof current === "object" && current !== null ? current : {};
    const normalizedType = normalizeType((jsonSchema as JsonSchema).type);

    const renderer =
      !isCycle && normalizedType ? RENDERERS[normalizedType] : undefined;

    const typeDetails = renderer
      ? renderer(jsonSchema as JsonSchema, currentContext, normalizedPath, helpers)
      : renderUnknown(
          jsonSchema as JsonSchema,
          currentContext,
          normalizedPath,
          helpers,
          isCycle ? "circular reference" : undefined,
        );

    const baseSummary = buildBaseSummary(
      jsonSchema as JsonSchema,
      currentContext,
      normalizedType,
    );

    const combined = combineResults(
      jsonSchema as JsonSchema,
      baseSummary,
      typeDetails,
    );
    resultsByPath.set(normalizedPath, combined);
    return current;
  });

  return (
    resultsByPath.get("$") ??
    combineResults(
      schema,
      buildBaseSummary(schema, context, normalizeType(schema.type)),
      {},
    )
  );
}

function normalizeType(
  type: JsonSchema["type"],
): JsonSchemaType | undefined {
  if (!type) {
    return undefined;
  }

  if (Array.isArray(type)) {
    return type[0];
  }

  return type;
}

export * from "./types";

function combineResults(
  schema: JsonSchema,
  baseSummary: PhrasingContent[],
  typeDetails: TypeRenderResult,
): SchemaRenderResult {
  const inline = typeDetails.summarySuffix
    ? [...baseSummary, ...typeDetails.summarySuffix]
    : baseSummary;

  const blocks: Content[] = [
    ...buildCommonBlocks(schema),
    ...buildGenericConstraintBlocks(schema),
    ...(typeDetails.blocks ?? []),
  ];

  return {
    inline,
    blocks,
  };
}

function normalizePath(path: string): string {
  return path && path.length > 0 ? path : "$";
}

function ensureContextForPath(
  path: string,
  contextByPath: Map<string, SchemaRenderContext>,
  parentContext?: SchemaRenderContext,
): SchemaRenderContext {
  const existing = contextByPath.get(path);
  if (existing) {
    return existing;
  }

  if (path === "$") {
    const root = parentContext ?? { name: "schema" };
    contextByPath.set(path, root);
    return root;
  }

  const derived = {
    name: deriveContextName(path, parentContext?.name),
  };
  contextByPath.set(path, derived);
  return derived;
}

function deriveContextName(path: string, parentName?: string): string {
  const tokens = splitPath(path);
  const last = tokens[tokens.length - 1] ?? "$";
  const secondLast = tokens.length >= 2 ? tokens[tokens.length - 2] : undefined;
  const fallbackParent = parentName ?? "schema";

  if (secondLast === "properties" || secondLast === "patternProperties") {
    return last;
  }

  if (secondLast === "definitions") {
    return `${fallbackParent} ${last}`;
  }

  if (last === "items") {
    return `${fallbackParent} item`;
  }

  const tupleMatch = last.match(/^items\[(\d+)\]$/);
  if (tupleMatch) {
    return `${fallbackParent} item ${tupleMatch[1]}`;
  }

  const combinatorMatch = last.match(/^(anyOf|oneOf|allOf)\[(\d+)\]$/);
  if (combinatorMatch) {
    const keyword = combinatorMatch[1] ?? "anyOf";
    const indexStr = combinatorMatch[2] ?? "0";
    const index = Number.parseInt(indexStr, 10) + 1;
    const label = keyword === "allOf" ? "requirement" : "option";
    return `${fallbackParent} ${label} ${index}`;
  }

  if (last === "contains") {
    return `${fallbackParent} contains`;
  }

  if (last === "additionalProperties") {
    return `${fallbackParent} additional property`;
  }

  if (last === "unevaluatedProperties") {
    return `${fallbackParent} unevaluated property`;
  }

  if (last === "propertyNames") {
    return `${fallbackParent} property names`;
  }

  const cleaned = last
    .replace(/\[(\d+)\]/g, " $1")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();

  return cleaned.length > 0 ? cleaned : fallbackParent;
}

function splitPath(path: string): string[] {
  return path.split(".").filter((segment) => segment.length > 0);
}

function parentSchemaPath(path: string): string | undefined {
  if (path === "$") {
    return undefined;
  }

  const tokens = splitPath(path);
  if (tokens.length <= 1) {
    return "$";
  }

  const secondLast = tokens[tokens.length - 2];
  if (
    secondLast === "properties" ||
    secondLast === "patternProperties" ||
    secondLast === "definitions"
  ) {
    const parentTokens = tokens.slice(0, -2);
    return parentTokens.length === 0 ? "$" : parentTokens.join(".");
  }

  const parentTokens = tokens.slice(0, -1);
  return parentTokens.length === 0 ? "$" : parentTokens.join(".");
}
