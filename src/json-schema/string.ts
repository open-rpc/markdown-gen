import type { ListItem, PhrasingContent } from "mdast";

import { buildConstraintSection } from "./base";
import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import { listItemFromText, text } from "./utils";

export function renderString(
  schema: JsonSchema,
  _context: SchemaRenderContext,
  _path: string,
  _helpers: SchemaRendererHelpers,
): TypeRenderResult {
  const summarySuffix: PhrasingContent[] = [];

  if (typeof schema.format === "string") {
    summarySuffix.push(text(` format: ${schema.format}`));
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    summarySuffix.push(
      text(` - ${schema.enum.length} allowed value${schema.enum.length > 1 ? "s" : ""}`),
    );
  }

  const constraintItems = gatherStringConstraintItems(schema);
  const blocks = buildConstraintSection("String Constraints", constraintItems);

  return {
    summarySuffix,
    blocks,
  };
}

function gatherStringConstraintItems(schema: JsonSchema): ListItem[] {
  const items: ListItem[] = [];

  if (typeof schema.pattern === "string" && schema.pattern.length > 0) {
    items.push(
      listItemFromText(
        `Must match the regular expression \`${schema.pattern}\`.`,
      ),
    );
  }

  if (typeof schema.minLength === "number") {
    items.push(
      listItemFromText(
        `Must be at least ${schema.minLength} character${schema.minLength === 1 ? "" : "s"} long.`,
      ),
    );
  }

  if (typeof schema.maxLength === "number") {
    items.push(
      listItemFromText(
        `Must not exceed ${schema.maxLength} character${schema.maxLength === 1 ? "" : "s"} in length.`,
      ),
    );
  }

  return items;
}
