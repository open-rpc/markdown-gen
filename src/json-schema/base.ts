import type { Content, ListItem, PhrasingContent } from "mdast";

import type { JsonSchema, JsonSchemaType, SchemaRenderContext } from "./types";
import {
  formatValue,
  headingFromText,
  inlineCode,
  listItem,
  listItemFromText,
  paragraphFromText,
  text,
  unorderedList,
} from "./utils";

export function buildBaseSummary(
  schema: JsonSchema,
  context: SchemaRenderContext,
  normalizedType: JsonSchemaType | undefined,
): PhrasingContent[] {
  const label = resolveTypeLabel(schema, normalizedType);
  return [inlineCode(context.name), text(` (${label})`)];
}

export function buildCommonBlocks(schema: JsonSchema): Content[] {
  const blocks: Content[] = [];

  if (typeof schema.description === "string" && schema.description.trim()) {
    blocks.push(paragraphFromText(schema.description.trim()));
  }

  if (schema.default !== undefined) {
    blocks.push(paragraphFromText(`Default: ${formatValue(schema.default)}`));
  }

  if (Array.isArray(schema.examples) && schema.examples.length > 0) {
    const exampleItems = schema.examples.map((example) =>
      listItemFromText(formatValue(example)),
    );
    blocks.push(headingFromText(5, "Examples"));
    blocks.push(unorderedList(exampleItems));
  }

  return blocks;
}

export function buildGenericConstraintBlocks(schema: JsonSchema): Content[] {
  const items: ListItem[] = [];

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    const values = schema.enum.map((value) => listItemFromText(formatValue(value)));
    items.push(
      listItem([
        paragraphFromText("Must be one of:"),
        unorderedList(values),
      ]),
    );
  }

  if (schema.const !== undefined) {
    items.push(
      listItem([
        paragraphFromText(`Must always be ${formatValue(schema.const)}.`),
      ]),
    );
  }

  return buildConstraintSection("Constraints", items);
}

export function buildConstraintSection(
  title: string,
  items: ListItem[],
): Content[] {
  if (items.length === 0) {
    return [];
  }

  return [headingFromText(5, title), unorderedList(items)];
}

function resolveTypeLabel(
  schema: JsonSchema,
  normalizedType: JsonSchemaType | undefined,
): string {
  if (normalizedType) {
    return normalizedType;
  }

  if (!schema.type) {
    return "unknown";
  }

  if (Array.isArray(schema.type)) {
    return schema.type.join(" | ");
  }

  return schema.type;
}
