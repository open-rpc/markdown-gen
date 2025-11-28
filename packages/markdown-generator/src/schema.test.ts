import { describe, expect, it } from "bun:test";
import { details, identitySchemaEdits, renderAtomicSchema } from "./schema";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mdxToMarkdown } from "mdast-util-mdx";
import type { Root, RootContent } from "mdast";

describe("schema", () => {
  it("should render details element", () => {
    const result = details("Show", "Team Object", "object", [
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
    ]);

    const markdown = toMarkdown(result, {
      extensions: [gfmToMarkdown(), mdxToMarkdown()],
    });
    console.log(markdown);
  });

  it("should render atomic schema", () => {
    const result = renderAtomicSchema(
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
});
