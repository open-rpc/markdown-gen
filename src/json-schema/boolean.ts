import type { PhrasingContent } from "mdast";

import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import { text } from "./utils";

export function renderBoolean(
  schema: JsonSchema,
  _context: SchemaRenderContext,
  _path: string,
  _helpers: SchemaRendererHelpers,
): TypeRenderResult {
  const summarySuffix: PhrasingContent[] = [];
  if (typeof schema.description === "string" && schema.description.trim()) {
    summarySuffix.push(text(` - ${schema.description.trim()}`));
  }

  return summarySuffix.length
    ? { summarySuffix }
    : {};
}
