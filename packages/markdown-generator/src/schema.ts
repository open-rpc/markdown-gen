import type {
  JSONSchema,
  ContentDescriptorObject,
  ErrorObject,
  MethodObjectExamples,
  ExamplePairingOrReference,
  MethodObjectParamStructure,
  MethodObjectErrors,
  ErrorOrReference,
} from "@open-rpc/meta-schema";
import type {
  ContentContainerDescriptor,
  DereffedMethodObject,
  DereffedMethodObjectResult,
  Edits,
  NoRefs,
  OpenRPCMdContent,
  SchemaEdits,
} from "./type";
import type { MdxJsxFlowElement } from "mdast-util-mdx";
import type {
  BlockContent,
  DefinitionContent,
  PhrasingContent,
  RootContent,
} from "mdast";

export const identitySchemaEdits: SchemaEdits = {
  editSchemaNumber: (content, schemaNumber) => content,
  editSchemaString: (content, text) => content,
  editSchemaAnyOf: (content, anyOf) => content,
  editSchemaOneOf: (content, oneOf) => content,
  editSchemaAllOf: (content, allOf) => content,
};

export const identityEdits: Edits = {
  editMethod: (content, method) => content,
  editMethodParam: (content, methodParam) => content,
  editMethodParamSchema: (content, methodParamSchema, methodParam) => content,
  editMethodParamSchemaParent: (content, methodParamSchema, methodParam) =>
    content,
  editMethodResult: (content, methodResult) => content,
  editMethodResultParent: (content, methodResult) => content,
  editMethodResultSchema: (content, methodResultSchema, methodResult) =>
    content,
  editMethodResultSchemaParent: (content, methodResultSchema, methodResult) =>
    content,
};

export interface DetailData {
  detailDescription: string;
  summaryTitle: string;
  summaryCode: string;
  summaryType: string;
  summaryContent: (BlockContent | DefinitionContent | MdxJsxFlowElement)[];
}
/*  Render heading helpers */

export function objectFieldList(
  fields: OpenRPCMdContent[][],
): OpenRPCMdContent {
  // Do not indent the details element
  return {
    type: "list",
    ordered: false,
    spread: true,
    children: fields.map((field) => ({
      type: "listItem",
      spread: true,
      children: field,
    })),
  };
}

export function objectSubHeading(title: string): OpenRPCMdContent {
  return {
    type: "heading",
    depth: 4,
    children: [
      { type: "inlineCode", value: title },
      { type: "text", value: " fields" },
    ],
  };
}
export function labelTypeStringForSchema(schema: NoRefs<JSONSchema>): string {
  if (typeof schema === "boolean") return "boolean";
  if (schema === null || schema === undefined) return "null";
  if (typeof schema === "object" && schema !== null) {
    if (schema.type === "array")
      return `array<${labelTypeStringForSchema(schema.items as NoRefs<JSONSchema>)}>`;
    if (schema.type === "object") return "object";
    if (schema.type === "string") return "string";
    if (schema.type === "number") return "number";
    if (schema.type === "integer") return "integer";
    if (schema.type === "null") return "null";
  }
  return "unknown";
}

// Add this new helper function
export function simpleDetails(
  summaryText: string,
  children: OpenRPCMdContent[],
): MdxJsxFlowElement {
  return {
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
            children: [{ type: "text", value: summaryText }],
          },
        ],
      },
      ...children,
    ],
  };
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
                value: `${detailData.summaryTitle} `,
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
      objectSubHeading(detailData.summaryCode),
      {
        type: "paragraph",
        children: [
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
  ofType: string | undefined = undefined,
): OpenRPCMdContent[] => {
  return [
    {
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: `${title}` }],
        },
        {
          type: "text",
          value: ` `,
        },
        ...((ofType
          ? [
              {
                type: "emphasis",
                children: [{ type: "text", value: `${ofType}` }],
              },
              {
                type: "text",
                value: ` `,
              },
            ]
          : []) as PhrasingContent[]),
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
  contentContainerDescriptor:
    | ContentContainerDescriptor
    | undefined = undefined,
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
        contentContainerDescriptor?.name ?? schema.title ?? "",
        contentContainerDescriptor?.isArray
          ? `array<${schema.type}>`
          : (schema.type ?? "null"),
        contentContainerDescriptor?.description ?? schema.description ?? "",
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

export function renderExample(
  example: NoRefs<ExamplePairingOrReference>,
  paramStructure: MethodObjectParamStructure,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (!example || typeof example !== "object") return [];

  const isByName = paramStructure === "by-name";

  const requestJson = {
    params: isByName
      ? Object.fromEntries(
          example.params?.map((param) => [param.name, param.value]) || [],
        )
      : example.params?.map((param) => param.value) || [],
  };

  // Wrap result in an object with its name as the key
  const responseJson = example.result ? example.result.value : undefined;

  const children: OpenRPCMdContent[] = [];

  // Add description if it exists
  if (example.description) {
    children.push({
      type: "paragraph",
      children: [{ type: "text", value: example.description }],
    });
  }

  // Add Request section
  children.push(
    {
      type: "heading",
      depth: 4,
      children: [{ type: "text", value: "Request" }],
    },
    {
      type: "code",
      lang: "json",
      value: JSON.stringify(requestJson, null, 2),
    },
  );

  // Add Response section
  children.push(
    {
      type: "heading",
      depth: 4,
      children: [{ type: "text", value: "Response" }],
    },
    {
      type: "code",
      lang: "json",
      value: JSON.stringify(responseJson, null, 2),
    },
  );

  return [simpleDetails(example.name, children)];
}

export function renderExamples(
  examples: NoRefs<MethodObjectExamples> | undefined = undefined,
  paramStructure: MethodObjectParamStructure = "either",
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (examples === undefined) return [];
  const exampleContent = examples.map((example) => {
    return renderExample(example, paramStructure, editSchema);
  });
  return [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: [
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Examples" }],
        },
        ...exampleContent.flat(),
      ],
    },
  ];
}

export function renderError(
  error: NoRefs<ErrorOrReference>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (!error || typeof error !== "object") return [];

  const children: OpenRPCMdContent[] = [];

  const listItems: any[] = [];

  // Add code as a list item with bold "code"
  listItems.push({
    type: "listItem",
    spread: false,
    children: [
      {
        type: "paragraph",
        children: [
          { type: "strong", children: [{ type: "text", value: "code" }] },
        ],
      },
      {
        type: "paragraph",
        children: [{ type: "text", value: String(error.code) }],
      },
    ],
  });

  // Add message as a list item with bold "message"
  if (error.message) {
    listItems.push({
      type: "listItem",
      spread: false,
      children: [
        {
          type: "paragraph",
          children: [
            { type: "strong", children: [{ type: "text", value: "message" }] },
          ],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: error.message }],
        },
      ],
    });
  }

  // Add data as a list item with bold "data" if present (inline code)
  if (error.data !== undefined) {
    const dataValue =
      typeof error.data === "string" ? error.data : JSON.stringify(error.data);

    listItems.push({
      type: "listItem",
      spread: false,
      children: [
        {
          type: "paragraph",
          children: [
            { type: "strong", children: [{ type: "text", value: "data" }] },
          ],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: dataValue }],
        },
      ],
    });
  }

  // Add the list of code/message/data fields
  children.push({
    type: "list",
    ordered: false,
    spread: false,
    children: listItems,
  });

  return [simpleDetails(`Error code: ${error.code}`, children)];
}

export function renderErrors(
  errors: NoRefs<MethodObjectErrors> | undefined,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (errors === undefined) return [];
  return [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: [
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Errors" }],
        },
        ...errors.map((error) => renderError(error, editSchema)).flat(),
      ],
    },
  ];
}

export function renderResults(
  result: DereffedMethodObjectResult | undefined,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  return [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: [
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "Result" }],
        },
        ...renderSchema(result, result?.schema, editSchema),
      ],
    },
  ];
}

function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, " ");
}

export function renderFrontMatter(
  title: string,
  description: string,
  tags: string[],
): RootContent[] {
  const frontMatterTemplate = `title: "${title}"
hide_table_of_contents: true
description: "${escapeYaml(description)}"
tags:
  - ${tags.join("\n    - ")}`;
  return [
    {
      type: "yaml",
      value: frontMatterTemplate,
    },
  ];
}

export function renderMethod(
  method: DereffedMethodObject,
  editSchema: SchemaEdits,
  edits: Edits,
): RootContent[] {
  const content = renderParams(
    method.params,
    method.paramStructure ?? "by-position",
    editSchema,
  );

  const methodFrontMatterContent: (OpenRPCMdContent | RootContent)[] = [
    ...renderFrontMatter(method.name, method.description ?? "asdfasdf", [
      "json-rpc",
      "openrpc",
      "method",
    ]),
  ];

  const methodContent: (OpenRPCMdContent | RootContent)[] = [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: [
        {
          type: "heading",
          depth: 1,
          children: [{ type: "text", value: `${method.name}` }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: method.description ?? "" }],
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: method.summary ?? "" }],
        },
        ...content,
        ...renderResults(method.result, editSchema),
        ...renderErrors(method.errors, editSchema),
        ...renderExamples(
          method.examples,
          method.paramStructure ?? "either",
          editSchema,
        ),
      ],
    },
  ];
  return [
    ...methodFrontMatterContent,
    ...(edits.editMethod?.(methodContent, method) ?? methodContent),
  ];
}

export function renderParams(
  params: ContentDescriptorObject[],
  paramStructure: MethodObjectParamStructure,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  const parameterContent = params
    .map((param) => {
      if (isComplexSchema(param.schema)) {
        // TODO: add title to param
        return renderSchema(param, param.schema, editSchema);
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
          param.description ?? param.schema.description ?? param.summary ?? "",
        );
      }
      return [];
    })
    // TODO this is temporary until we get here
    .flat();
  if (params.length === 0) {
    parameterContent.push({
      type: "paragraph",
      children: [
        { type: "text", value: "This method does not accept any parameters." },
      ],
    });
  }
  const paramStructureLabel =
    paramStructure === "either"
      ? "by name or by position"
      : paramStructure.split("-").join(" ");
  return [
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: [
        {
          type: "heading",
          depth: 2,
          children: [
            { type: "text", value: `Parameters (${paramStructureLabel})` },
          ],
        },
        ...parameterContent,
      ],
    },
  ];
}

export function renderObjectSchema(
  contentDescriptor: ContentContainerDescriptor | undefined = undefined,
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (schema === null || schema === undefined || typeof schema !== "object")
    return [];
  const children: OpenRPCMdContent[] = [];
  const fieldData: OpenRPCMdContent[][] = [];
  for (const [key, value] of Object.entries(schema.properties ?? {})) {
    fieldData.push(
      renderSchema(
        { name: key, description: value.description },
        value,
        editSchema,
      ),
    );
  }
  children.push(objectFieldList(fieldData));
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
    ...renderAtomicHelper(
      contentDescriptor?.name ?? "",
      contentDescriptor?.isArray ? `array<object>` : "object",
      contentDescriptor?.description ?? "",
    ),
    {
      type: "mdxJsxFlowElement",
      name: "div",
      attributes: [],
      children: result as OpenRPCMdContent[],
    },
  ];
}

export function renderOfTypeSchema(
  contentDescriptor: Partial<ContentDescriptorObject> | undefined = undefined,
  ofType: "allOf" | "oneOf" | "anyOf",
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || !schema[ofType]) return [];
  if (schema === null || schema === undefined) return [];
  // TODO handle arrays
  if (!(schema[ofType] || Array.isArray(schema[ofType]))) return [];
  if (typeof schema === "object" && schema !== null) {
    const allofChildren: OpenRPCMdContent[][] = schema[ofType].map(
      (schema, idx: number) => {
        const schemaContent = renderSchema(
          contentDescriptor,
          schema,
          editSchema,
        );
        if (typeof schema !== "object" || schema == null) {
          return schemaContent;
        }

        return [
          details({
            summaryTitle: `Show Option ${idx + 1}`,
            summaryCode: contentDescriptor?.name ?? "",
            // TODO: schema can actually be an array
            summaryType: (schema.type as string) ?? "",
            summaryContent: schemaContent.flat(),
            detailDescription: contentDescriptor?.description ?? "",
          }),
        ];
      },
    );
    return [
      {
        type: "mdxJsxFlowElement",
        name: "div",
        attributes: [],
        children: [
          ...renderAtomicHelper(
            contentDescriptor?.name ?? "",
            // TODO schema can also just be a bool
            `${schema[ofType]?.map((schema) => labelTypeStringForSchema(schema as NoRefs<JSONSchema>)).join(" or ")}`,
            contentDescriptor?.description ?? "",
            ofType,
          ),
          ...(allofChildren.flat() as OpenRPCMdContent[]),
        ],
      },
    ];
  }
  return [];
}

export function renderSchema(
  contentDescriptor: ContentContainerDescriptor | undefined = undefined,
  schema: NoRefs<JSONSchema> | undefined = undefined,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  let children: OpenRPCMdContent[] = [];
  if (schema === null || schema === undefined) return [];
  if (typeof schema === "object" && schema !== null) {
    if (schema.allOf) {
      return renderOfTypeSchema(contentDescriptor, "allOf", schema, editSchema);
    }
    if (schema.oneOf) {
      return renderOfTypeSchema(contentDescriptor, "oneOf", schema, editSchema);
    }
    if (schema.anyOf) {
      return renderOfTypeSchema(contentDescriptor, "anyOf", schema, editSchema);
    }
    if (schema.type === "array") {
      if (typeof schema.items === "object") {
        const containingContent = { ...contentDescriptor, isArray: true };
        return renderSchema(containingContent, schema.items, editSchema);
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
        return renderAtomicSchema(contentDescriptor, schema, editSchema);
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
