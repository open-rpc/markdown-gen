import type {
  OpenrpcDocument,
  MethodObject,
  MethodObjectParams,
  MethodObjectResult,
  Methods,
  ContentDescriptorOrReference,
  JSONSchema,
  ContentDescriptorObject,
} from "@open-rpc/meta-schema";
import type {
  BlockContent,
  DefinitionContent,
  Root,
  RootContent,
  Yaml,
} from "mdast";
import type {
  MdxFlowExpression,
  MdxJsxAttributeValueExpression,
  MdxJsxExpressionAttribute,
  MdxJsxFlowElement,
} from "mdast-util-mdx";

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

export type DereffedOpenrpcDocument = NoRefs<OpenrpcDocument>;
export type DereffedMethodObject = NoRefs<MethodObject>;
export type DereffedMethodObjectParams = NoRefs<MethodObjectParams>;
export type DereffedMethodObjectParam = NoRefs<ContentDescriptorOrReference>;
export type DereffedMethodObjectParamSchema = NoRefs<JSONSchema>;
export type DereffedMethodObjectResultSchema = NoRefs<JSONSchema>;
export type DereffedMethods = NoRefs<Methods>;
export type DereffedMethodObjectResult = NoRefs<MethodObjectResult>;

export interface ContentContainerDescriptor
  extends Partial<ContentDescriptorObject> {
  isArray?: boolean;
}

export type OpenRPCMdContent =
  | BlockContent
  | DefinitionContent
  | MdxFlowExpression
  | MdxJsxFlowElement
  | MdxJsxExpressionAttribute;

export interface SchemaEdits {
  editSchemaNumber?: (
    content: (RootContent | MdxJsxFlowElement)[],
    schemaNumber: number,
  ) => (RootContent | MdxJsxFlowElement)[];
  editSchemaString?: (
    content: (RootContent | MdxJsxFlowElement)[],
    text: string,
  ) => (RootContent | MdxJsxFlowElement)[];
  editSchemaAnyOf?: (
    content: (RootContent | MdxJsxFlowElement)[],
    anyOf: JSONSchema[],
  ) => (RootContent | MdxJsxFlowElement)[];
  editSchemaOneOf?: (
    content: (RootContent | MdxJsxFlowElement)[],
    oneOf: JSONSchema[],
  ) => (RootContent | MdxJsxFlowElement)[];
  editSchemaAllOf?: (
    content: (RootContent | MdxJsxFlowElement)[],
    allOf: JSONSchema[],
  ) => (RootContent | MdxJsxFlowElement)[];
}

export interface Edits {
  editMethodParent?: (content: Root, method: DereffedMethodObject) => Root;
  editMethod?: (
    content: (OpenRPCMdContent | RootContent)[],
    method: DereffedMethodObject,
  ) => (OpenRPCMdContent | RootContent)[];

  editMethodParamsParent?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParams: DereffedMethodObjectParams,
  ) => (RootContent | MdxJsxFlowElement)[];
  editMethodParam?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParam: DereffedMethodObjectParam,
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodParamSchema?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParamSchema: DereffedMethodObjectParamSchema,
    methodParam: DereffedMethodObjectParam,
  ) => (RootContent | MdxJsxFlowElement)[];
  editMethodParamSchemaParent?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodParamSchema: DereffedMethodObjectParamSchema,
    methodParam: DereffedMethodObjectParam,
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodResult?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResult: DereffedMethodObjectResult,
  ) => (RootContent | MdxJsxFlowElement)[];
  editMethodResultParent?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResult: DereffedMethodObjectResult,
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodResultSchema?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResultSchema: DereffedMethodObjectResultSchema,
    methodResult: DereffedMethodObjectResult,
  ) => (RootContent | MdxJsxFlowElement)[];

  editMethodResultSchemaParent?: (
    content: (RootContent | MdxJsxFlowElement)[],
    methodResultSchema: DereffedMethodObjectResultSchema,
    methodResult: DereffedMethodObjectResult,
  ) => (RootContent | MdxJsxFlowElement)[];
}
