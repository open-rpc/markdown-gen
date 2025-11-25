import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import { text } from "./utils";

export function renderUnknown(
  schema: JsonSchema | undefined,
  _context: SchemaRenderContext,
  _path: string,
  _helpers: SchemaRendererHelpers,
  note?: string,
): TypeRenderResult {
  const summarySuffix = note ? [text(` - ${note}`)] : undefined;

  return {
    summarySuffix,
    blocks: [],
  };
}
