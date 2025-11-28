import type { JSONSchema, Properties } from "@open-rpc/meta-schema";
import type {
  DereffedMethodObject,
  DereffedOpenrpcDocument,
  DereffedMethodObjectParamSchema,
  DereffedMethodObjectParam,
  NoRefs,
} from "./type";

export function traverseSchema(schema: DereffedMethodObjectParamSchema) {
  //if traverse is a schema type return
}

export function traverseSchemaObject(obj: DereffedMethodObjectParamSchema) {
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj.properties ?? {})) {
      if (typeof value === "object") {
        if (value.type === "object") {
          traverseSchemaObject(value);
        }
      }
      traverseSchemaObject(value);
    }
  }
}

export function traverseParam(param: DereffedMethodObjectParam) {
  //if traverse is a schema type return
  if (typeof param.schema === "object") {
    if (typeof param.schema === "object") {
      if (param.schema.type === "object") {
        traverseObject(param.schema);
      }
    }
  }
  console.log(param);
}

export function traverseMethod(method: DereffedMethodObject) {
  //if traverse is a schema type return
  method.params.forEach((param) => {
    traverseParam(param);
  });
}

export function traverseDocument(document: DereffedOpenrpcDocument) {
  //if traverse is a schema type return
  document.methods.forEach((method) => {
    traverseMethod(method);
  });
}
