import { describe, expect, it } from "bun:test";
import {
  details,
  identitySchemaEdits,
  renderAtomicSchema,
  renderMethod,
  renderParams,
  renderSchema,
} from "./schema";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mdxToMarkdown } from "mdast-util-mdx";
import type { Root, RootContent } from "mdast";
import type { NoRefs, OpenRPCMdContent } from "./type";
import type { JSONSchema } from "@open-rpc/meta-schema";

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
  const teamObjectSchema = {
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
                description: "The timeout in milliseconds of the super config",
              },
            },
          },
        },
      },
    },
  };

  it("should render a schema", () => {
    const result = renderSchema(
      { name: "teamObject" },
      teamObjectSchema as NoRefs<JSONSchema>,
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

  it("should render params", () => {
    const result = renderParams(
      [
        {
          name: "owner",
          required: true,
          description: "The owner of the team ",
          schema: { type: "string" },
        },
        {
          name: "id",
          required: false,
          description: "The id of the team ",
          schema: { type: "integer" },
        },
        {
          name: "teamObject",
          required: true,
          description: "The team object",
          schema: teamObjectSchema as NoRefs<JSONSchema>,
        },
      ],
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

  it("should render method", () => {
    const result = renderMethod(
      {
        name: "getTeam",
        description: "Get a team by id",
        summary:
          "Get a team by id. The method returns a team object, and can be called with a team object.",
        params: [
          {
            name: "id",
            required: true,
            description: "The id of the team",
            schema: { type: "string" },
          },
          {
            name: "md_name",
            required: false,
            description: "The name of the team",
            schema: {
              allOf: [{ type: "string" }, { type: "integer" }],
            },
          },
          {
            name: "teamObject",
            required: true,
            description: "The team object",
            schema: teamObjectSchema as NoRefs<JSONSchema>,
          },
        ],
        result: {
          name: "teamObject",
          required: true,
          description: "The team object",
          schema: teamObjectSchema as NoRefs<JSONSchema>,
        },
        errors: [
          {
            code: 4000,
            message: "Bad Request",
            data: { message: "Team not found" },
          },
          {
            code: 5000,
            message: "Internal Server Error",
            data: "asdfjkalsgj;awigejoa null pointer Stack Trace",
          },
        ],
        paramStructure: "by-name",
        examples: [
          {
            name: "getTeam",
            description: "Get a team by id",
            params: [
              { name: "id", value: "123" },
              { name: "teamObject", value: { id: "123", name: "Team 1" } },
            ],
            result: {
              name: "teamObject",
              value: { id: "123", name: "Team 1" },
            },
          },
          {
            name: "getTeam",
            description: "Get a team by id",
            params: [{ name: "id", value: "456" }],
            result: {
              name: "teamObject",
              value: { id: "456" },
            },
          },
        ],
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
