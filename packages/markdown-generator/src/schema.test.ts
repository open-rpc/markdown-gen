import { describe, expect, it } from "bun:test";
import {
  details,
  identitySchemaEdits,
  renderAtomicSchema,
  renderSchema,
} from "./schema";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mdxToMarkdown } from "mdast-util-mdx";
import type { Root, RootContent } from "mdast";
import type { OpenRPCMdContent } from "./type";

describe("schema", () => {
  it("should render details element", () => {
    const summaryContent: OpenRPCMdContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Team Object was the best one on record",
          },
          {
            type: "html",
            value: "<br/>",
          },
          {
            type: "text",
            value: "Team Object was the best one on record",
          },
        ],
      },
    ];
    const result = details({
      summaryTitle: "Show",
      summaryCode: "Team Object",
      summaryType: "object",
      summaryContent: summaryContent,
      detailDescription: "Team Object was the best one on record",
    });

    const markdown = toMarkdown(result, {
      extensions: [gfmToMarkdown(), mdxToMarkdown()],
    });
    console.log(markdown);
  });

  it("should render atomic schema", () => {
    const result = renderAtomicSchema(
      undefined,
      undefined,
      {
        title: "Integer",
        type: "integer",
        description: "An integer of great reknown",
      },
      identitySchemaEdits,
    );
    const root: Root = {
      type: "root",
      children: result,
    };
    const markdown = toMarkdown(root, {
      extensions: [gfmToMarkdown(), mdxToMarkdown()],
    });
    console.log(markdown);
  });

  it("should render a schema", () => {
    const result = renderSchema(
      { name: "Team Object", description: "A team object" },
      {
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the user" },
          age: { type: "integer", description: "The age of the user" },
        },
      },
      identitySchemaEdits,
    );
    const root: Root = {
      type: "root",
      children: result,
    };
    const markdown = toMarkdown(root, {
      extensions: [gfmToMarkdown(), mdxToMarkdown()],
    });
    console.log(markdown);
  });
});
