import { describe, expect, it } from "bun:test";
import type { RootContent, BlockContent, DefinitionContent, Root } from "mdast";
import { type MdxJsxFlowElement } from "mdast-util-mdx";
import { toMarkdown } from "mdast-util-to-markdown";
import { mdxToMarkdown } from "mdast-util-mdx";
import { gfmToMarkdown } from "mdast-util-gfm";

import type { DereffedOpenrpcDocument } from "./type";
import { renderMethod } from ".";

interface Baz {
  name: string;
}

interface Bar {
  age: number;
  baz: Baz;
}

interface TinyDoc {
  foo: string;
  bar: Bar;
  manyBars: Bar[];
}

const document: DereffedOpenrpcDocument = {
  openrpc: "1.3.2",
  info: {
    title: "Pet Store",
    description: "Interact with the virtual pet store.",
    version: "1.0.0",
  },
  methods: [
    {
      name: "listPets",
      summary: "List all pets registered in the store.",
      params: [
        {
          name: "limit",
          summary: "How many items to return at one time (max 100).",
          schema: { type: "integer" },
        },
      ],
      result: {
        name: "pets",
        summary: "A collection of pets.",
        schema: { type: "array" },
      },
    },
    {
      name: "createPet",
      description: "Create a new pet in the store.",
      params: [
        {
          name: "pet",
          description: "Pet to add to the store.",
          schema: { type: "object" },
        },
      ],
      result: {
        name: "pet",
        summary: "The created pet.",
        schema: { type: "object" },
      },
    },
  ],
};

type WithMarkdownExtensions<T> = T extends object
  ? {
      [K in keyof T]: WithMarkdownExtensions<T[K]>;
    } & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [K in keyof T as `x-markdown-${string & K}`]?: any; // ← Scoped to actual keys
    }
  : T;

type MarkdownOpenRPCDocument = WithMarkdownExtensions<DereffedOpenrpcDocument>;

type ExtendedTinyDoc = WithMarkdownExtensions<TinyDoc>;

describe("methods", () => {
  it("renders a methods", () => {
    const results = document.methods.map((method) => {
      return renderMethod(method, {
        editMethodParent: (content, method) => {
          const children: (RootContent | MdxJsxFlowElement)[] = [];
          children.push({
            type: "mdxjsEsm",
            value: "import MyReactComponent from './MyReactComponent.mdx';",
          });
          children.push({
            type: "mdxJsxFlowElement",
            name: "MyReactComponent",
            attributes: [],
            children: content.children as (BlockContent | DefinitionContent)[],
          });
          return {
            children,
            type: "root",
          };
        },
      });
    });

    /*

     writeMarkdownMethod(filepath: string, edits: Edits) -> [string] -> paths it wrote to

    node OPenRPCDocumentTree () { };
    tree = getOpenRPCTree( path: string) -> OpenRPCDocumentTree;
    return toMarkdown(tree, {
      extensions: [openRPCToMarkdown( {edits: docsPlugin}), gfmToMarkdown(), mdxToMarkdown()],
    })
    */
    // eslint-disable-next-line no-console
    console.log(
      results
        .map((result) => {
          return toMarkdown(result, {
            extensions: [gfmToMarkdown(), mdxToMarkdown()],
          });
        })
        .join("\n"),
    );
  });
});
