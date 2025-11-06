import type { Content, ListItem, PhrasingContent } from "mdast";

import { buildConstraintSection } from "./base";
import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import {
  listItem,
  listItemFromText,
  paragraphFromPhrasing,
  paragraphFromText,
  text,
  unorderedList,
} from "./utils";

function pickFirstItemSchema(items: JsonSchema | JsonSchema[] | undefined) {
  if (!items) {
    return undefined;
  }

  return Array.isArray(items) ? items[0] : items;
}

export function renderArray(
  schema: JsonSchema,
  context: SchemaRenderContext,
  path: string,
  helpers: SchemaRendererHelpers,
): TypeRenderResult {
  const firstItemSchema = pickFirstItemSchema(schema.items);
  const summarySuffix: PhrasingContent[] = [];

  if (firstItemSchema?.type) {
    summarySuffix.push(
      text(` of ${formatTypeLabel(firstItemSchema.type)}`),
    );
  }

  const blocks: Content[] = [];

  if (firstItemSchema) {
    const itemPath = Array.isArray(schema.items)
      ? `${path}.items[0]`
      : `${path}.items`;
    const renderedItem = helpers.getResult(itemPath);
    const renderedContext = helpers.getContext(itemPath);

    if (renderedItem?.inline.length) {
      blocks.push(
        paragraphFromPhrasing([
          text("Items: "),
          ...(renderedContext
            ? removeLeadingName(renderedItem.inline, renderedContext.name)
            : renderedItem.inline),
        ]),
      );
    }

    if (renderedItem?.blocks.length) {
      blocks.push(...renderedItem.blocks);
    }
  }

  const constraintItems = gatherArrayConstraintItems(schema);
  if (constraintItems.length > 0) {
    blocks.push(...buildConstraintSection("Array Constraints", constraintItems));
  }

  return {
    summarySuffix,
    blocks,
  };
}

function formatTypeLabel(type: JsonSchema["type"]): string {
  if (Array.isArray(type)) {
    return type.join(" | ");
  }

  return type;
}

function gatherArrayConstraintItems(schema: JsonSchema): ListItem[] {
  const items: ListItem[] = [];

  if (typeof schema.minItems === "number") {
    items.push(
      listItemFromText(
        `Must contain at least ${schema.minItems} item${
          schema.minItems === 1 ? "" : "s"
        }.`,
      ),
    );
  }

  if (typeof schema.maxItems === "number") {
    items.push(
      listItemFromText(
        `Must not contain more than ${schema.maxItems} item${
          schema.maxItems === 1 ? "" : "s"
        }.`,
      ),
    );
  }

  if (schema.uniqueItems) {
    items.push(
      listItemFromText(
        "All items must be unique.",
      ),
    );
  }

  if (schema.contains) {
    const requirements: Content[] = [
      paragraphFromText("Must contain items matching the defined schema."),
    ];

    const detailConstraints: ListItem[] = [];
    if (typeof schema.minContains === "number") {
      detailConstraints.push(
        listItemFromText(`At least ${schema.minContains} matching item${schema.minContains === 1 ? "" : "s"}.`),
      );
    }
    if (typeof schema.maxContains === "number") {
      detailConstraints.push(
        listItemFromText(`At most ${schema.maxContains} matching item${schema.maxContains === 1 ? "" : "s"}.`),
      );
    }

    if (detailConstraints.length > 0) {
      requirements.push(unorderedList(detailConstraints));
    }

    items.push(listItem(requirements));
  }

  return items;
}

function removeLeadingName(
  inlineChildren: PhrasingContent[],
  name: string,
): PhrasingContent[] {
  if (!inlineChildren.length) {
    return inlineChildren;
  }

  const [first, ...rest] = inlineChildren;
  if (first.type === "inlineCode" && first.value === name) {
    return rest;
  }

  return inlineChildren;
}
