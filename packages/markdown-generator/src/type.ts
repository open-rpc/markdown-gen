import type {
  OpenrpcDocument,
  MethodObject,
  MethodObjectParams,
  MethodObjectResult,
  Methods,
  ContentDescriptorOrReference,
  JSONSchema,
  ContentDescriptorObject,
  MethodObjectExamples,
  ExamplePairingOrReference,
  MethodObjectErrors,
  ErrorOrReference,
} from "@open-rpc/meta-schema";
import type { BlockContent, DefinitionContent, RootContent } from "mdast";
import type { MdxFlowExpression, MdxJsxFlowElement } from "mdast-util-mdx";

export type RefNode = { $ref: string };

export type NoRefs<T> =
  // If T itself is a ref → remove it
  T extends RefNode
    ? never
    : // If T is an array → apply recursively to element type
      T extends (infer U)[]
      ? NoRefs<U>[]
      : // If T is an object → map over its properties
        T extends object
        ? { [K in keyof T]: NoRefs<T[K]> }
        : // Primitives (string, number, etc.) are left as-is
          T;
export interface ErrorGroupItem extends NoRefs<ErrorOrReference> {
  "x-error-category"?: string;
}

export type ErrorGroups = ErrorGroupItem[];

export type DereffedOpenrpcDocument = NoRefs<OpenrpcDocument>;
export type DereffedMethodObject = NoRefs<MethodObject>;
export type DereffedMethodObjectParams = NoRefs<MethodObjectParams>;
export type DereffedMethodObjectParam = NoRefs<ContentDescriptorOrReference>;
export type DereffedMethodObjectParamSchema = NoRefs<JSONSchema>;
export type DereffedMethodObjectResultSchema = NoRefs<JSONSchema>;
export type DereffedMethodObjectExamples = NoRefs<MethodObjectExamples>;
export type DereffedMethodObjectExample = NoRefs<ExamplePairingOrReference>;
export type DereffedMethods = NoRefs<Methods>;
export type DereffedMethodObjectResult = NoRefs<MethodObjectResult>;
export type DereffedMethodObjectErrorsWithGroup = NoRefs<MethodObjectErrors>;
export type DereffedMethodObjectErrorWithGroup = NoRefs<
  ErrorOrReference | ErrorGroupItem
>;

export interface ContentContainerDescriptor
  extends Partial<ContentDescriptorObject> {
  isArray?: boolean;
  ofType?: "allOf" | "oneOf" | "anyOf";
  constraintsSchema?: NoRefs<JSONSchema>;
}

export type OpenRPCMdContent =
  | BlockContent
  | DefinitionContent
  | MdxFlowExpression
  | MdxJsxFlowElement;

export interface SchemaEdits {
  //editSchemaPrimitive?
  //editSchemaObject?
  //editSchemaOfType?
  editSchemaObject: (
    content: OpenRPCMdContent[],
    schema: JSONSchema,
  ) => OpenRPCMdContent[];
  editSchemaBoolean: (
    content: OpenRPCMdContent[],
    schema: JSONSchema,
  ) => OpenRPCMdContent[];
  editSchemaNull: (content: OpenRPCMdContent[]) => OpenRPCMdContent[];

  editSchemaPrimitive: (
    content: OpenRPCMdContent[],
    schema: JSONSchema,
  ) => OpenRPCMdContent[];

  editSchemaOfType: (
    content: OpenRPCMdContent[],
    schema: JSONSchema,
  ) => OpenRPCMdContent[];

  editSchemaOfTypes: (
    content: OpenRPCMdContent[],
    schema: JSONSchema[],
  ) => OpenRPCMdContent[];
}

export interface Edits {
  editMethodErrorsParent: (
    content: OpenRPCMdContent[],
    errors: DereffedMethodObjectErrorsWithGroup,
  ) => OpenRPCMdContent[];
  editMethodError: (
    content: OpenRPCMdContent[],
    error: DereffedMethodObjectErrorWithGroup,
  ) => OpenRPCMdContent[];
  editMethodParent: (
    content: RootContent[] | OpenRPCMdContent[],
    method: DereffedMethodObject,
  ) => RootContent[] | OpenRPCMdContent[];
  editMethod: (
    content: (OpenRPCMdContent | RootContent)[],
    method: DereffedMethodObject,
  ) => (OpenRPCMdContent | RootContent)[];

  editMethodParamsParent: (
    content: OpenRPCMdContent[],
    methodParams: DereffedMethodObjectParams,
  ) => OpenRPCMdContent[];

  editMethodParam: (
    content: OpenRPCMdContent[],
    methodParam: DereffedMethodObjectParam,
  ) => OpenRPCMdContent[];

  editMethodParamSchema: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParamSchema: DereffedMethodObjectParamSchema,
    methodParam: DereffedMethodObjectParam,
  ) => (RootContent | MdxJsxFlowElement)[];
  editMethodParamSchemaParent: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParamSchema: DereffedMethodObjectParamSchema,
    methodParam: DereffedMethodObjectParam,
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodResult: (
    content: OpenRPCMdContent[],
    methodResult: DereffedMethodObjectResult | undefined,
  ) => OpenRPCMdContent[];

  editMethodResultParent: (
    content: OpenRPCMdContent[],
    methodResult: DereffedMethodObjectResult | undefined,
  ) => OpenRPCMdContent[];

  editMethodExample: (
    content: OpenRPCMdContent[],
    example: DereffedMethodObjectExample,
  ) => OpenRPCMdContent[];

  editMethodExampleParent: (
    content: OpenRPCMdContent[],
    examples: DereffedMethodObjectExamples,
  ) => OpenRPCMdContent[];

  editMethodResultSchema: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResultSchema: DereffedMethodObjectResultSchema,
    methodResult: DereffedMethodObjectResult,
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodResultSchemaParent: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResultSchema: DereffedMethodObjectResultSchema,
    methodResult: DereffedMethodObjectResult,
  ) => (RootContent | MdxJsxFlowElement)[];
}
