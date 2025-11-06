import type { Content, ListItem, PhrasingContent } from "mdast";

import { buildConstraintSection } from "./base";
import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  TypeRenderResult,
} from "./types";
import {
  formatValue,
  inlineCode,
  listItem,
  listItemFromText,
  paragraphFromPhrasing,
  paragraphFromText,
  tableCell,
  tableRow,
  text,
  textCell,
  unorderedList,
} from "./utils";

function extractProperties(schema: JsonSchema): Array<[string, JsonSchema]> {
  return Object.entries(schema.properties ?? {});
}

function isRequired(schema: JsonSchema, property: string): boolean {
  return Array.isArray(schema.required) && schema.required.includes(property);
}

export function renderObject(
  schema: JsonSchema,
  context: SchemaRenderContext,
  path: string,
  helpers: SchemaRendererHelpers,
): TypeRenderResult {
  const properties = extractProperties(schema);
  const summarySuffix: PhrasingContent[] = [];

  if (properties.length > 0) {
    summarySuffix.push(
      text(
        ` - ${properties.length} propert${
          properties.length > 1 ? "ies" : "y"
        }`,
      ),
    );
  } else {
    summarySuffix.push(text(" - no defined properties"));
  }

  const blocks: Content[] = [];
  if (properties.length > 0) {
    const header = tableRow([
      textCell("Property"),
      textCell("Type"),
      textCell("Details"),
    ]);

    const rows = properties.map(([propertyName, propertySchema]) => {
      const requirementSuffix = isRequired(schema, propertyName)
        ? text(" (required)")
        : undefined;

      const propertyCellChildren = requirementSuffix
        ? [inlineCode(propertyName), requirementSuffix]
        : [inlineCode(propertyName)];

      const detailParagraph = renderPropertyDetails(
        path,
        propertyName,
        helpers,
        propertySchema,
      );

      return tableRow([
        tableCell(propertyCellChildren),
        textCell(resolveTypeLabel(propertySchema)),
        {
          type: "tableCell",
          children: [detailParagraph],
        },
      ]);
    });
    blocks.push({
      type: "table",
      align: [null, null, null],
      children: [header, ...rows],
    });
  } else {
    blocks.push(paragraphFromText("No defined properties."));
  }

  const constraintItems = gatherObjectConstraintItems(schema);
  if (constraintItems.length > 0) {
    blocks.push(...buildConstraintSection("Object Constraints", constraintItems));
  }

  return {
    summarySuffix,
    blocks,
  };
}

function resolveTypeLabel(schema: JsonSchema): string {
  const type = schema.type;
  if (!type) {
    return "unknown";
  }

  if (Array.isArray(type)) {
    return type.join(" | ");
  }

  return type;
}

function renderPropertyDetails(
  parentPath: string,
  propertyName: string,
  helpers: SchemaRendererHelpers,
  propertySchema: JsonSchema,
) {
  const propertyPath = `${parentPath}.properties.${propertyName}`;
  const propertyResult = helpers.getResult(propertyPath);
  const propertyContext = helpers.getContext(propertyPath);

  if (propertyResult && propertyContext) {
    const inlineChildren = removeLeadingName(
      propertyResult.inline,
      propertyContext.name,
    );
    if (inlineChildren.length > 0) {
      return paragraphFromPhrasing(inlineChildren);
    }
  }

  if (typeof propertySchema.description === "string") {
    return paragraphFromText(propertySchema.description);
  }

  if (Array.isArray(propertySchema.enum) && propertySchema.enum.length > 0) {
    return paragraphFromText(
      `Allowed: ${propertySchema.enum.map((value) => formatValue(value)).join(", ")}`,
    );
  }

  if (propertySchema.default !== undefined) {
    return paragraphFromText(`Default: ${formatValue(propertySchema.default)}`);
  }

  if (propertyResult && propertyResult.inline.length > 0) {
    return paragraphFromPhrasing(propertyResult.inline);
  }

  return paragraphFromText("No additional details.");
}

function gatherObjectConstraintItems(schema: JsonSchema): ListItem[] {
  const items: ListItem[] = [];

  if (typeof schema.minProperties === "number") {
    items.push(
      listItemFromText(
        `Must have at least ${schema.minProperties} propert${
          schema.minProperties === 1 ? "y" : "ies"
        }.`,
      ),
    );
  }

  if (typeof schema.maxProperties === "number") {
    items.push(
      listItemFromText(
        `Must not exceed ${schema.maxProperties} propert${
          schema.maxProperties === 1 ? "y" : "ies"
        }.`,
      ),
    );
  }

  if (Array.isArray(schema.required) && schema.required.length > 0) {
    const requiredItems = schema.required.map((name) =>
      listItemFromText(`\`${name}\``),
    );
    items.push(
      listItem([
        paragraphFromText("Required properties:"),
        unorderedList(requiredItems),
      ]),
    );
  }

  if (schema.dependentRequired) {
    for (const [key, deps] of Object.entries(schema.dependentRequired)) {
      if (Array.isArray(deps) && deps.length > 0) {
        const dependentItems = deps.map((dep) => listItemFromText(`\`${dep}\``));
        items.push(
          listItem([
            paragraphFromText(`When \`${key}\` is present, must also include:`),
            unorderedList(dependentItems),
          ]),
        );
      }
    }
  }

  return items;
}

function removeLeadingName(
  inlineChildren: PhrasingContent[],
  name: string,
): PhrasingContent[] {
  if (inlineChildren.length === 0) {
    return inlineChildren;
  }

  const [first, ...rest] = inlineChildren;
  if (
    first.type === "inlineCode" &&
    typeof first.value === "string" &&
    first.value === name
  ) {
    return rest;
  }

  return inlineChildren;
}
