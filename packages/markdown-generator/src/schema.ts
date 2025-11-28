import type {
  JSONSchema,
  ContentDescriptorObject,
} from "@open-rpc/meta-schema";
import type { NoRefs, OpenRPCMdContent, SchemaEdits } from "./type";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import type { BlockContent, DefinitionContent, RootContent } from "mdast";

export const identitySchemaEdits: SchemaEdits = {
  editSchemaNumber: (content, schemaNumber) => content,
  editSchemaString: (content, text) => content,
  editSchemaAnyOf: (content, anyOf) => content,
  editSchemaOneOf: (content, oneOf) => content,
  editSchemaAllOf: (content, allOf) => content,
};

export function details(
  summaryTitle: string = "Show",
  summaryCode: string,
  summaryType: string,
  summaryContent: (BlockContent | DefinitionContent | MdxJsxFlowElement)[],
): MdxJsxFlowElement {
  const summary: MdxJsxFlowElement = {
    type: "mdxJsxFlowElement",
    name: "details",
    attributes: [],
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "summary",
        attributes: [],
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                value: `Show ${summaryTitle}`,
              },
              {
                type: "inlineCode",
                value: summaryCode,
              },
              {
                type: "text",
                value: ` ${summaryType}`,
              },
            ],
          },
        ],
      },
      ...summaryContent,
    ],
  };

  return summary;
}

const renderAtomicHelper = (
  title: string,
  type: string,
  desc: string,
): OpenRPCMdContent[] => {
  return [
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: `${title}`,
        },
        {
          type: "inlineCode",
          value: `${type}`,
        },
      ],
    },
    {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: `${desc}`,
        },
      ],
    },
  ];
};

export function renderAtomicSchema(
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
  descriptor?: ContentDescriptorObject,
): OpenRPCMdContent[] {
  if (typeof schema !== "object" || schema === null) {
    return [];
  }

  const title = descriptor?.title ?? schema.title ?? "";
  const description = descriptor?.description ?? schema.description ?? "";

  switch (schema.type) {
    case "integer":
    case "number":
    case "string":
    case "boolean":
    case "null":
      return renderAtomicHelper(
        schema.title ?? "",
        schema.type,
        schema.description ?? "",
      );
  }
  return [];
}

export function renderSchema(
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
  descriptor?: ContentDescriptorObject,
): OpenRPCMdContent[] {
  let children: OpenRPCMdContent[] = [];

  if (typeof schema === "object" && schema !== null) {
    if (schema.allOf) {
      schema.allOf.map((schema) => renderSchema(schema, editSchema));
    }
    if (schema.oneOf) {
      schema.oneOf.map((schema) => renderSchema(schema, editSchema));
      //children.push(...editSchema.editSchemaOneOf(children, schema.oneOf));
    }
    if (schema.anyOf) {
      schema.anyOf.map((schema) => renderSchema(schema, editSchema));
      //children.push(...editSchema.editSchemaAnyOf(children, schema.anyOf));
    }
    if (schema.type === "array") {
      if (typeof schema.items === "object") {
        renderSchema(schema.items, editSchema);
      }
      if (Array.isArray(schema.items)) {
        schema.items.map((item) => renderSchema(item, editSchema));
      }
    }
    switch (schema.type) {
      case "integer":
      case "number":
      case "string":
      case "null":
      case "boolean":
        return renderAtomicSchema(schema, editSchema);
      case "object":
        return renderObjectSchema(schema, editSchema);
    }
  }

  return [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: children as OpenRPCMdContent[],
    },
  ];
}
