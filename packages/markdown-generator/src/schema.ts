import type {
  JSONSchema,
  ContentDescriptorObject,
  ErrorObject,
  ExampleObject,
} from "@open-rpc/meta-schema";
import type { NoRefs, OpenRPCMdContent, SchemaEdits } from "./type";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import type { BlockContent, DefinitionContent, RootContent } from "mdast";
import type { OpenRPCContentDescriptor } from ".";

export const identitySchemaEdits: SchemaEdits = {
  editSchemaNumber: (content, schemaNumber) => content,
  editSchemaString: (content, text) => content,
  editSchemaAnyOf: (content, anyOf) => content,
  editSchemaOneOf: (content, oneOf) => content,
  editSchemaAllOf: (content, allOf) => content,
};

export interface DetailData {
  detailDescription: string;
  summaryTitle: string;
  summaryCode: string;
  summaryType: string;
  summaryContent: (BlockContent | DefinitionContent | MdxJsxFlowElement)[];
}

export function details(detailData: DetailData): MdxJsxFlowElement {
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
                value: `Show ${detailData.summaryTitle}`,
              },
              {
                type: "inlineCode",
                value: detailData.summaryCode,
              },
              {
                type: "text",
                value: ` ${detailData.summaryType}`,
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            // TODO: check the break element makes sense and isn't a conditional render here
            type: "break",
          },
          {
            type: "text",
            value: detailData.detailDescription,
          },
        ],
      },
      ...detailData.summaryContent,
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
  title: string | undefined = undefined,
  description: string | undefined = undefined,
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (typeof schema !== "object" || schema === null) {
    return [];
  }

  switch (schema.type) {
    case "integer":
    case "number":
    case "string":
    case "boolean":
    case "null":
      return renderAtomicHelper(
        title ?? schema.title ?? "",
        schema.type,
        description ?? schema.description ?? "",
      );
  }
  return [];
}

function isComplexSchema(schema: NoRefs<JSONSchema>): boolean {
  if (!schema || schema === null || schema === undefined) return false;
  if (typeof schema === "boolean") return false;
  if (schema?.allOf || schema?.oneOf || schema?.anyOf) return true;
  if (
    (typeof schema === "object" && schema.type === "object") ||
    schema.type === "array"
  )
    return true;

  return false;
}

export function renderExamples(
  examples: ExampleObject[],
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  return [];
}

export function renderErrors(
  errors: ErrorObject[],
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  return [];
}

export function renderResults(
  result: ContentDescriptorObject,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  return [];
}

export function renderParams(
  params: ContentDescriptorObject[],
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  return (
    params
      .map((param) => {
        if (isComplexSchema(param.schema)) {
          // TODO: add title to param
          return renderSchema(
            { name: param.name, description: param.description },
            param.schema,
            editSchema,
          );
        }
        if (param.schema === null || param.schema === undefined) return [];
        if (typeof param.schema === "boolean") return [];
        if (
          param.schema &&
          typeof param.schema === "object" &&
          param.schema !== null
        ) {
          return renderAtomicHelper(
            param.name,
            param.schema.type as string,
            param.description ?? param.schema.description ?? "",
          );
        }
        return [];
      })
      // TODO this is temporary until we get here
      .flat()
  );
}

export function renderObjectSchema(
  contentDescriptor: Partial<ContentDescriptorObject> | undefined = undefined,
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (schema === null || schema === undefined || typeof schema !== "object")
    return [];
  const children: OpenRPCMdContent[] = [];

  for (const [key, value] of Object.entries(schema.properties ?? {})) {
    children.push(
      ...renderSchema(
        { name: key, description: value.description },
        value,
        editSchema,
      ),
    );
  }
  // aggregate the children into a details element
  const detailData: DetailData = {
    summaryTitle: "Show",
    summaryCode: contentDescriptor?.name ?? "",
    summaryType: "object",
    summaryContent: children,
    detailDescription: contentDescriptor?.description ?? "",
  };
  const result = [details(detailData)];
  return [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: result as OpenRPCMdContent[],
    },
  ];
}

export function renderSchema(
  contentDescriptor: Partial<ContentDescriptorObject> | undefined = undefined,
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  let children: OpenRPCMdContent[] = [];

  if (typeof schema === "object" && schema !== null) {
    if (schema.allOf) {
      schema.allOf.map((schema) =>
        renderSchema(contentDescriptor, schema, editSchema),
      );
    }
    if (schema.oneOf) {
      schema.oneOf.map((schema) =>
        renderSchema(contentDescriptor, schema, editSchema),
      );
      //children.push(...editSchema.editSchemaOneOf(children, schema.oneOf));
    }
    if (schema.anyOf) {
      schema.anyOf.map((schema) =>
        renderSchema(contentDescriptor, schema, editSchema),
      );
      //children.push(...editSchema.editSchemaAnyOf(children, schema.anyOf));
    }
    if (schema.type === "array") {
      if (typeof schema.items === "object") {
        renderSchema(contentDescriptor, schema.items, editSchema);
      }
      if (Array.isArray(schema.items)) {
        schema.items.map((item) =>
          renderSchema(contentDescriptor, item, editSchema),
        );
      }
    }
    switch (schema.type) {
      case "integer":
      case "number":
      case "string":
      case "null":
      case "boolean":
        return renderAtomicSchema(
          contentDescriptor?.name,
          contentDescriptor?.description,
          schema,
          editSchema,
        );
      case "object":
        return renderObjectSchema(contentDescriptor, schema, editSchema);
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
