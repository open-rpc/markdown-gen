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

  it("should render object schema", () => {
    const result = renderSchema(
      { name: "teamObject" },
      {
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the user" },
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

  it("should render nested object schema", () => {
    const result = renderSchema(
      { name: "teamObject" },
      {
        type: "object",
        properties: {
          config: { type: "object", properties: { id: { type: "string" } } },
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

  it.only("should render a schema", () => {
    const result = renderSchema(
      { name: "teamObject" },
      {
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the user" },
          age: { type: "integer", description: "The age of the user" },
          nickname: { type: "string", description: "The nickname of the user" },
          config: {
            type: "object",
            properties: {
              id: { type: "string", description: "The id of the config" },
              name: { type: "string", description: "The name of the config" },
              retry_count: {
                type: "integer",
                description: "The retry count of the config",
              },
              timeout_ms: {
                type: "integer",
                description: "The timeout in milliseconds of the config",
              },
              altConfig: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The id of the super config",
                  },
                  name: {
                    type: "string",
                    description: "The name of the super config",
                  },
                  retry_count: {
                    type: "integer",
                    description: "The retry count of the super config",
                  },
                  timeout_ms: {
                    type: "integer",
                    description:
                      "The timeout in milliseconds of the super config",
                  },
                },
              },
            },
          },
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
