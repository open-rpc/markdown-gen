import type {
  JSONSchema,
  ContentDescriptorObject,
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
import { humanizeSchemaConstraints } from "./humanize";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";

export const identitySchemaEdits: SchemaEdits = {
  editSchemaNumber: (content, _schemaNumber) => content,
  editSchemaString: (content, _text) => content,
  editSchemaAnyOf: (content, _anyOf) => content,
  editSchemaOneOf: (content, _oneOf) => content,
  editSchemaAllOf: (content, _allOf) => content,
};

export const identityEdits: Edits = {
  editMethod: (content, _method) => content,
  editMethodParam: (content, _methodParam) => content,
  editMethodParamSchema: (content, _methodParamSchema, _methodParam) => content,
  editMethodParamSchemaParent: (content, _methodParamSchema, _methodParam) =>
    content,
  editMethodResult: (content, _methodResult) => content,
  editMethodResultParent: (content, _methodResult) => content,
  editMethodResultSchema: (content, _methodResultSchema, _methodResult) =>
    content,
  editMethodResultSchemaParent: (content, _methodResultSchema, _methodResult) =>
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

const parseMarkdownToNodes = (markdown: string): OpenRPCMdContent[] => {
  if (!markdown || markdown.trim() === "") {
    return [];
  }

  const tree = fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  return tree.children as OpenRPCMdContent[];
};

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
      ...parseMarkdownToNodes(detailData.detailDescription),
      ...detailData.summaryContent,
    ],
  };

  return summary;
}

const getParamDescription = (contentMd: ContentContainerDescriptor): string => {
  if (contentMd.description) {
    return contentMd.description;
  }
  if (contentMd.summary) {
    return contentMd.summary;
  }
  if (
    contentMd.schema &&
    typeof contentMd.schema === "object" &&
    contentMd.schema !== null &&
    contentMd.schema.description
  ) {
    return contentMd.schema.description;
  }
  return "";
};

const getSchemaDescription = (
  contentMd: ContentContainerDescriptor,
  schema: NoRefs<JSONSchema>,
): string => {
  if (contentMd.description) {
    return contentMd.description;
  }
  if (!schema || typeof schema !== "object" || schema === null) {
    return "";
  }
  if (schema.description) {
    return schema.description;
  }
  if (schema.title) return schema.title;

  return "";
};

const renderSchemaConstraints = (
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] => {
  if (!schema || typeof schema !== "object" || schema === null) {
    return [];
  }

  return humanizeSchemaConstraints(schema).flat();
};

const renderAtomicHelper = (
  title: string,
  type: string,
  desc: string,
  contentMd: ContentContainerDescriptor,
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
        ...((contentMd.ofType
          ? [
              {
                type: "emphasis",
                children: [{ type: "text", value: `${contentMd?.ofType}` }],
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
        ...((contentMd.required
          ? [
              {
                type: "text",
                value: ` `,
              },
              {
                type: "emphasis",
                children: [{ type: "text", value: `required` }],
              },
            ]
          : []) as PhrasingContent[]),
      ],
    },
    ...parseMarkdownToNodes(desc),
    ...renderSchemaConstraints(contentMd.constraintsSchema ?? {}),
    {
      type: "thematicBreak",
    },
  ];
};

export function renderAtomicSchema(
  contentContainerDescriptor:
    | ContentContainerDescriptor
    | undefined = undefined,
  schema: NoRefs<JSONSchema>,
  _editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  const container = {
    ...contentContainerDescriptor,
    constraintsSchema: schema,
  } as ContentContainerDescriptor;
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
        getSchemaDescription(container ?? {}, schema),
        container ?? {},
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
  _editSchema: SchemaEdits,
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
  _editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (!error || typeof error !== "object") return [];

  const children: OpenRPCMdContent[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        ...renderSchema(
          { ...result, constraintsSchema: result?.schema },
          result?.schema,
          editSchema,
        ),
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
  const validTags = tags.filter(
    (tag): tag is string => tag !== undefined && tag !== null && tag !== "",
  );

  const tagsSection =
    validTags.length > 0 ? `\ntags:\n  - ${validTags.join("\n  - ")}` : "";

  const frontMatterTemplate = `# GENERATED DOCUMENTATION - DO NOT EDIT THIS FILE
title: "${title}"
hide_table_of_contents: true
description: "${escapeYaml(description)}"${tagsSection}`;

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
  let content = renderParams(
    method.params,
    method.paramStructure ?? "by-position",
    editSchema,
  );

  if (edits.editMethodParamsParent)
    content = edits.editMethodParamsParent(content, method.params);

  const methodFrontMatterContent: (OpenRPCMdContent | RootContent)[] = [
    ...renderFrontMatter(
      method.name,
      method.description ?? "",
      method.tags?.map((tag) => tag.name) ?? ([] as string[]),
    ),
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
          getParamDescription(param),
          param,
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

const requiredField = (
  schema: NoRefs<JSONSchema>,
  fieldName: string,
): boolean => {
  if (schema === null || schema === undefined || typeof schema !== "object")
    return false;
  return schema.required?.includes(fieldName) ?? false;
};

export function renderObjectSchema(
  contentDescriptor: ContentContainerDescriptor | undefined = undefined,
  schema: NoRefs<JSONSchema>,
  editSchema: SchemaEdits,
): OpenRPCMdContent[] {
  if (schema === null || schema === undefined || typeof schema !== "object")
    return [];
  const children: OpenRPCMdContent[] = [];
  const fieldData: OpenRPCMdContent[][] = [];
  for (const [key, value] of Object.entries(schema.properties ?? {}).concat(
    Object.entries(schema.patternProperties ?? {}),
  )) {
    fieldData.push(
      renderSchema(
        {
          name: key,
          description: value.description,
          required: requiredField(
            contentDescriptor?.constraintsSchema ?? {},
            key,
          ),
          constraintsSchema: value ?? {},
        },
        value,
        editSchema,
      ),
    );
  }

  children.push(objectFieldList(fieldData));
  // aggregate the children into a details element
  const detailData: DetailData = {
    summaryTitle: "Show",
    summaryCode: contentDescriptor?.title ?? contentDescriptor?.name ?? "",
    summaryType: "object",
    summaryContent: children,
    detailDescription: contentDescriptor?.description ?? "",
  };
  const result = [details(detailData)];
  const container = {
    ...contentDescriptor,
    constraintsSchema: schema,
  };

  return [
    ...renderAtomicHelper(
      container?.name ?? "",
      container?.isArray ? `array<object>` : "object",
      getSchemaDescription(container ?? {}, schema),
      container ?? {},
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
          {
            ...contentDescriptor,
            constraintsSchema: schema,
          },
          schema,
          editSchema,
        );
        if (typeof schema !== "object" || schema == null) {
          return schemaContent;
        }

        return [
          details({
            summaryTitle: `Show Option ${idx + 1}`,
            summaryCode:
              schema.title ??
              contentDescriptor?.constraintsSchema?.title ??
              contentDescriptor?.name ??
              "",
            // TODO: schema can actually be an array
            summaryType: (schema.type as string) ?? "",
            summaryContent: schemaContent.flat(),
            detailDescription:
              schema.description ?? contentDescriptor?.description ?? "",
          }),
        ];
      },
    );
    const container = {
      ...contentDescriptor,
      constraintsSchema: contentDescriptor?.schema,
    } as ContentContainerDescriptor;
    return [
      {
        type: "mdxJsxFlowElement",
        name: "div",
        attributes: [],
        children: [
          ...renderAtomicHelper(
            container?.name ?? "",
            // TODO schema can also just be a bool
            `${schema[ofType]?.map((schema) => labelTypeStringForSchema(schema as NoRefs<JSONSchema>)).join(" or ")}`,
            // NOTE special case for OneOfs can only be one of the 2 options
            container?.description ?? container?.summary ?? "",
            container ?? {},
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
        const containingContent = {
          ...contentDescriptor,
          isArray: true,
          constraintsSchema: schema.items,
        };
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
