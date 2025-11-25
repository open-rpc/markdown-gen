import { describe, expect, it } from "bun:test";

import { renderSchema } from "../src/index.ts";
import type { JsonSchema } from "../src/types.ts";

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

  it("fully renders a complex schema tree", () => {
    const schema: JsonSchema = {
      type: "object",
      description: "A composite schema covering multiple JSON Schema features.",
      properties: {
        id: {
          type: "string",
          format: "uuid",
          minLength: 3,
          description: "Unique identifier.",
        },
        status: {
          type: "string",
          enum: ["active", "disabled"],
          default: "active",
        },
        retryCount: {
          type: "integer",
          minimum: 0,
          maximum: 5,
          default: 1,
        },
        metadata: {
          type: "object",
          properties: {
            createdAt: {
              type: "string",
              format: "date-time",
            },
            flags: {
              type: "array",
              items: { type: "string", enum: ["beta", "legacy", "hidden"] },
              uniqueItems: true,
              minItems: 1,
              contains: {
                type: "string",
                pattern: "^beta",
              },
              minContains: 1,
              maxContains: 2,
            },
            featureToggle: {
              type: "boolean",
              default: false,
            },
          },
          required: ["createdAt"],
          minProperties: 1,
        },
        readings: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              value: {
                type: "number",
                minimum: 0,
                maximum: 100,
                multipleOf: 0.5,
              },
              unit: {
                type: "string",
                enum: ["ms", "s"],
              },
            },
            required: ["value"],
          },
        },
      },
      required: ["id", "status", "metadata"],
      dependentRequired: {
        metadata: ["readings"],
      },
      examples: [
        {
          id: "084f109a-bbb0-4d3e-a8b6-e5dcdbe7a546",
          status: "active",
        },
      ],
    };

    const result = renderSchema(schema, { name: "root" });

    expect(result).toMatchInlineSnapshot(`
      {
        "blocks": [
          {
            "children": [
              {
                "type": "text",
                "value": "A composite schema covering multiple JSON Schema features.",
              },
            ],
            "type": "paragraph",
          },
          {
            "children": [
              {
                "type": "text",
                "value": "Examples",
              },
            ],
            "depth": 5,
            "type": "heading",
          },
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "{"id":"084f109a-bbb0-4d3e-a8b6-e5dcdbe7a546","status":"active"}",
                      },
                    ],
                    "type": "paragraph",
                  },
                ],
                "spread": false,
                "type": "listItem",
              },
            ],
            "ordered": false,
            "spread": false,
            "type": "list",
          },
          {
            "align": [
              null,
              null,
              null,
            ],
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "Property",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "Type",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "Details",
                      },
                    ],
                    "type": "tableCell",
                  },
                ],
                "type": "tableRow",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "inlineCode",
                        "value": "id",
                      },
                      {
                        "type": "text",
                        "value": " (required)",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "string",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": " (string)",
                      },
                      {
                        "type": "text",
                        "value": " format: uuid",
                      },
                    ],
                    "type": "tableCell",
                  },
                ],
                "type": "tableRow",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "inlineCode",
                        "value": "status",
                      },
                      {
                        "type": "text",
                        "value": " (required)",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "string",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": " (string)",
                      },
                      {
                        "type": "text",
                        "value": " - 2 allowed values",
                      },
                    ],
                    "type": "tableCell",
                  },
                ],
                "type": "tableRow",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "inlineCode",
                        "value": "retryCount",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "integer",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": " (integer)",
                      },
                    ],
                    "type": "tableCell",
                  },
                ],
                "type": "tableRow",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "inlineCode",
                        "value": "metadata",
                      },
                      {
                        "type": "text",
                        "value": " (required)",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "object",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": " (object)",
                      },
                      {
                        "type": "text",
                        "value": " - 3 properties",
                      },
                    ],
                    "type": "tableCell",
                  },
                ],
                "type": "tableRow",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "inlineCode",
                        "value": "readings",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "array",
                      },
                    ],
                    "type": "tableCell",
                  },
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": " (array)",
                      },
                      {
                        "type": "text",
                        "value": " of object",
                      },
                    ],
                    "type": "tableCell",
                  },
                ],
                "type": "tableRow",
              },
            ],
            "type": "table",
          },
          {
            "children": [
              {
                "type": "text",
                "value": "Object Constraints",
              },
            ],
            "depth": 5,
            "type": "heading",
          },
          {
            "children": [
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "Required properties:",
                      },
                    ],
                    "type": "paragraph",
                  },
                  {
                    "children": [
                      {
                        "children": [
                          {
                            "children": [
                              {
                                "type": "text",
                                "value": "\`id\`",
                              },
                            ],
                            "type": "paragraph",
                          },
                        ],
                        "spread": false,
                        "type": "listItem",
                      },
                      {
                        "children": [
                          {
                            "children": [
                              {
                                "type": "text",
                                "value": "\`status\`",
                              },
                            ],
                            "type": "paragraph",
                          },
                        ],
                        "spread": false,
                        "type": "listItem",
                      },
                      {
                        "children": [
                          {
                            "children": [
                              {
                                "type": "text",
                                "value": "\`metadata\`",
                              },
                            ],
                            "type": "paragraph",
                          },
                        ],
                        "spread": false,
                        "type": "listItem",
                      },
                    ],
                    "ordered": false,
                    "spread": false,
                    "type": "list",
                  },
                ],
                "spread": false,
                "type": "listItem",
              },
              {
                "children": [
                  {
                    "children": [
                      {
                        "type": "text",
                        "value": "When \`metadata\` is present, must also include:",
                      },
                    ],
                    "type": "paragraph",
                  },
                  {
                    "children": [
                      {
                        "children": [
                          {
                            "children": [
                              {
                                "type": "text",
                                "value": "\`readings\`",
                              },
                            ],
                            "type": "paragraph",
                          },
                        ],
                        "spread": false,
                        "type": "listItem",
                      },
                    ],
                    "ordered": false,
                    "spread": false,
                    "type": "list",
                  },
                ],
                "spread": false,
                "type": "listItem",
              },
            ],
            "ordered": false,
            "spread": false,
            "type": "list",
          },
        ],
        "inline": [
          {
            "type": "inlineCode",
            "value": "root",
          },
          {
            "type": "text",
            "value": " (object)",
          },
          {
            "type": "text",
            "value": " - 5 properties",
          },
        ],
      }
    `);
  });
});
