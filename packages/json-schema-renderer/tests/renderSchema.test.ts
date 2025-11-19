import { describe, expect, it } from "bun:test";

import { renderSchema } from "../src/index.ts";

describe("renderSchema", () => {
  it("renders an unknown summary when schema input is missing", () => {
    const result = renderSchema(undefined, { name: "param" });

    expect(result).toEqual({
      inline: [
        { type: "inlineCode", value: "param" },
        { type: "text", value: " (unknown)" },
      ],
      blocks: [],
    });
  });

  it("includes string specific metadata and constraints", () => {
    const schema = {
      type: "string",
      format: "uri",
      enum: ["a", "b"],
      pattern: "^https?://",
      minLength: 3,
    };

    const result = renderSchema(schema, { name: "endpoint" });

    expect(result.inline).toEqual([
      { type: "inlineCode", value: "endpoint" },
      { type: "text", value: " (string)" },
      { type: "text", value: " format: uri" },
      { type: "text", value: " - 2 allowed values" },
    ]);

    expect(result.blocks).toEqual([
      {
        type: "heading",
        depth: 5,
        children: [{ type: "text", value: "Constraints" }],
      },
      {
        type: "list",
        ordered: false,
        spread: false,
        children: [
          {
            type: "listItem",
            spread: false,
            children: [
              {
                type: "paragraph",
                children: [{ type: "text", value: "Must be one of:" }],
              },
              {
                type: "list",
                ordered: false,
                spread: false,
                children: [
                  {
                    type: "listItem",
                    spread: false,
                    children: [
                      {
                        type: "paragraph",
                        children: [{ type: "text", value: '"a"' }],
                      },
                    ],
                  },
                  {
                    type: "listItem",
                    spread: false,
                    children: [
                      {
                        type: "paragraph",
                        children: [{ type: "text", value: '"b"' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        depth: 5,
        children: [{ type: "text", value: "String Constraints" }],
      },
      {
        type: "list",
        ordered: false,
        spread: false,
        children: [
          {
            type: "listItem",
            spread: false,
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    value: "Must match the regular expression `^https?://`.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            spread: false,
            children: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    value: "Must be at least 3 characters long.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("renders nested object properties with helper-derived summaries", () => {
    const schema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "integer" },
      },
      required: ["name"],
    };

    const result = renderSchema(schema, { name: "user" });

    expect(result.inline).toEqual([
      { type: "inlineCode", value: "user" },
      { type: "text", value: " (object)" },
      { type: "text", value: " - 2 properties" },
    ]);

    expect(result.blocks).toEqual([
      {
        type: "table",
        align: [null, null, null],
        children: [
          {
            type: "tableRow",
            children: [
              {
                type: "tableCell",
                children: [{ type: "text", value: "Property" }],
              },
              {
                type: "tableCell",
                children: [{ type: "text", value: "Type" }],
              },
              {
                type: "tableCell",
                children: [{ type: "text", value: "Details" }],
              },
            ],
          },
          {
            type: "tableRow",
            children: [
              {
                type: "tableCell",
                children: [
                  { type: "inlineCode", value: "name" },
                  { type: "text", value: " (required)" },
                ],
              },
              {
                type: "tableCell",
                children: [{ type: "text", value: "string" }],
              },
              {
                type: "tableCell",
                children: [{ type: "text", value: " (string)" }],
              },
            ],
          },
          {
            type: "tableRow",
            children: [
              {
                type: "tableCell",
                children: [{ type: "inlineCode", value: "age" }],
              },
              {
                type: "tableCell",
                children: [{ type: "text", value: "integer" }],
              },
              {
                type: "tableCell",
                children: [{ type: "text", value: " (integer)" }],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        depth: 5,
        children: [{ type: "text", value: "Object Constraints" }],
      },
      {
        type: "list",
        ordered: false,
        spread: false,
        children: [
          {
            type: "listItem",
            spread: false,
            children: [
              {
                type: "paragraph",
                children: [{ type: "text", value: "Required properties:" }],
              },
              {
                type: "list",
                ordered: false,
                spread: false,
                children: [
                  {
                    type: "listItem",
                    spread: false,
                    children: [
                      {
                        type: "paragraph",
                        children: [{ type: "text", value: "`name`" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});
