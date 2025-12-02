export { renderMethod, identityEdits, identitySchemaEdits } from "./schema";
export type {
  SchemaEdits,
  Edits,
  DereffedOpenrpcDocument,
  NoRefs,
} from "./type";

import {
  dereferenceDocument,
  parseOpenRPCDocument,
} from "@open-rpc/schema-utils-js";
import type {
  DereffedMethodObject,
  DereffedOpenrpcDocument,
  Edits,
  NoRefs,
  SchemaEdits,
} from "./type";
import { identitySchemaEdits, renderMethod } from "./schema";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mdxToMarkdown } from "mdast-util-mdx";
import { frontmatterToMarkdown } from "mdast-util-frontmatter";

import type { Root } from "mdast";
import type {
  MethodObject,
  MethodOrReference,
  OpenrpcDocument,
} from "@open-rpc/meta-schema";

interface MethodToMarkdown {
  methodName: string;
  markdown: string;
}

export async function renderMethodsToMarkdown(
  document: OpenrpcDocument,
  edits: Edits,
  schemaEdits: SchemaEdits,
): Promise<MethodToMarkdown[]> {
  const dereferencedDocument = await dereferenceDocument(document);
  const parsedDocument = await parseOpenRPCDocument(dereferencedDocument);

  return parsedDocument.methods.map((method) => {
    const methodContent = renderMethod(
      method as NoRefs<MethodObject>,
      identitySchemaEdits,
    );
    const rootDocument: Root = {
      type: "root",
      children: methodContent,
    };
    return {
      methodName: (method as DereffedMethodObject).name,
      markdown: toMarkdown(rootDocument, {
        extensions: [gfmToMarkdown(), mdxToMarkdown(), frontmatterToMarkdown()],
      }),
    };
  });
}
