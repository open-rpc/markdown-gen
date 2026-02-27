import type { V1_3, V1_4 } from "@open-rpc/spec-types";

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
export type ErrorGroupItem = NoRefs<ErrorOrReference> & {
  "x-error-category"?: string;
};

export type OpenrpcDocument = V1_3.OpenrpcDocument | V1_4.OpenrpcDocument;
export type MethodObject = V1_3.MethodObject | V1_4.MethodObject;
export type MethodObjectParams =
  | V1_3.MethodObjectParams
  | V1_4.MethodObjectParams;
export type ContentDescriptorOrReference =
  | V1_3.ContentDescriptorOrReference
  | V1_4.ContentDescriptorOrReference;
export type JSONSchema = V1_3.JSONSchema | V1_4.JSONSchema;
export type MethodObjectExamples =
  | V1_3.MethodObjectExamples
  | V1_4.MethodObjectExamples;
export type ExamplePairingOrReference =
  | V1_3.ExamplePairingOrReference
  | V1_4.ExamplePairingOrReference;
export type Methods = V1_3.Methods | V1_4.Methods;
export type MethodObjectResult =
  | V1_3.MethodObjectResult
  | V1_4.MethodObjectResult;
export type MethodObjectErrors =
  | V1_3.MethodObjectErrors
  | V1_4.MethodObjectErrors;
export type MethodObjectParamStructure =
  | V1_3.MethodObjectParamStructure
  | V1_4.MethodObjectParamStructure;
export type ErrorOrReference = V1_3.ErrorOrReference | V1_4.ErrorOrReference;
export type ContentDescriptorObject =
  | V1_3.ContentDescriptorObject
  | V1_4.ContentDescriptorObject;
export type ErrorGroups = ErrorGroupItem[];
export type SimpleTypes = V1_3.SimpleTypes | V1_4.SimpleTypes;

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

export type ContentContainerDescriptor = Partial<ContentDescriptorObject> & {
  isArray?: boolean;
  ofType?: "allOf" | "oneOf" | "anyOf";
  constraintsSchema?: NoRefs<JSONSchema>;
};

export type OpenRPCMdContent =
  | BlockContent
  | DefinitionContent
  | MdxFlowExpression
  | MdxJsxFlowElement;

export interface SchemaEdits {
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

  editMethodResult: (
    content: OpenRPCMdContent[],
    methodResult: DereffedMethodObjectResult | undefined,
  ) => OpenRPCMdContent[];

  editMethodResultParent: (
    content: OpenRPCMdContent[],
    methodResult: DereffedMethodObjectResult | undefined,
  ) => OpenRPCMdContent[];

  editMethodErrorsParent: (
    content: OpenRPCMdContent[],
    errors: DereffedMethodObjectErrorsWithGroup,
  ) => OpenRPCMdContent[];
  editMethodError: (
    content: OpenRPCMdContent[],
    error: DereffedMethodObjectErrorWithGroup,
  ) => OpenRPCMdContent[];

  editMethodExampleParent: (
    content: OpenRPCMdContent[],
    examples: DereffedMethodObjectExamples,
  ) => OpenRPCMdContent[];

  editMethodExample: (
    content: OpenRPCMdContent[],
    example: DereffedMethodObjectExample,
  ) => OpenRPCMdContent[];
}
