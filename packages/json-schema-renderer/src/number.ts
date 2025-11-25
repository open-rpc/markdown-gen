import type { ListItem, PhrasingContent } from "mdast";

import { buildConstraintSection } from "./base";
import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import { listItemFromText, text } from "./utils";

export type NumericSchemaType = "number" | "integer";

export function renderNumber(
  schema: JsonSchema,
  _context: SchemaRenderContext,
  _path: string,
  _helpers: SchemaRendererHelpers,
  type: NumericSchemaType,
): TypeRenderResult {
  const summarySuffix: PhrasingContent[] = [];

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    summarySuffix.push(
      text(
        ` - ${schema.enum.length} allowed value${
          schema.enum.length > 1 ? "s" : ""
        }`,
      ),
    );
  }

  const constraintItems = gatherNumericConstraintItems(schema);
  const blocks = buildConstraintSection(
    `${capitalize(type)} Constraints`,
    constraintItems,
  );

  return {
    summarySuffix,
    blocks,
  };
}

function gatherNumericConstraintItems(schema: JsonSchema): ListItem[] {
  const items: ListItem[] = [];

  if (typeof schema.multipleOf === "number") {
    items.push(listItemFromText(`Must be a multiple of ${schema.multipleOf}.`));
  }

  if (typeof schema.minimum === "number") {
    items.push(
      listItemFromText(`Must be greater than or equal to ${schema.minimum}.`),
    );
  }

  if (typeof schema.exclusiveMinimum === "number") {
    items.push(
      listItemFromText(
        `Must be strictly greater than ${schema.exclusiveMinimum}.`,
      ),
    );
  }

  if (typeof schema.maximum === "number") {
    items.push(
      listItemFromText(`Must be less than or equal to ${schema.maximum}.`),
    );
  }

  if (typeof schema.exclusiveMaximum === "number") {
    items.push(
      listItemFromText(
        `Must be strictly less than ${schema.exclusiveMaximum}.`,
      ),
    );
  }

  return items;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
