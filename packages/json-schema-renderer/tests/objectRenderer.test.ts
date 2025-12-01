import { describe, expect, it } from "bun:test";

import { renderObject, __objectInternals } from "../src/object.ts";
import type { JsonSchema, SchemaRendererHelpers } from "../src/types.ts";
import { paragraphFromText } from "../src/utils.ts";

describe("renderObject", () => {
  const helpers: SchemaRendererHelpers = {
    getResult: (path) => {
      if (path.endsWith(".properties.id")) {
        return {
          inline: [
            { type: "inlineCode", value: "id" },
            { type: "text", value: " (string)" },
            { type: "text", value: " extra" },
          ],
          blocks: [],
        };
      }
      if (path.endsWith(".properties.meta")) {
        return {
          inline: [{ type: "text", value: "meta inline" }],
          blocks: [paragraphFromText("meta block")],
        };
      }
      if (path.endsWith(".properties.notes")) {
        return { inline: [], blocks: [] };
      }
      return undefined;
    },
    getContext: (path) => {
      if (path.endsWith(".properties.id")) {
        return { name: "id" };
      }
      if (path.endsWith(".properties.meta")) {
        return undefined;
      }
      return undefined;
    },
  };

  it("renders property details and constraint combinations", () => {
    const schema: JsonSchema = {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { enum: ["active", "disabled"] },
        retries: { default: 1 },
        description: { description: "Inline text" },
        meta: { type: "object" },
        notes: {},
        choice: { type: ["number", "null"] },
      },
      required: ["id"],
      minProperties: 1,
      maxProperties: 4,
      dependentRequired: {
        meta: ["status"],
      },
    };

    const result = renderObject(schema, { name: "obj" }, "$", helpers);
    expect(result.summarySuffix).toEqual([
      { type: "text", value: " - 7 properties" },
    ]);
    expect(result.blocks).toMatchInlineSnapshot(`
      [
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
                      "value": " extra",
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
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "unknown",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "Allowed: "active", "disabled"",
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
                      "value": "retries",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "unknown",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "Default: 1",
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
                      "value": "description",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "unknown",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "Inline text",
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
                      "value": "meta",
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
                      "value": "meta inline",
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
                      "value": "notes",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "unknown",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "No additional details.",
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
                      "value": "choice",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "number | null",
                    },
                  ],
                  "type": "tableCell",
                },
                {
                  "children": [
                    {
                      "type": "text",
                      "value": "No additional details.",
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
                      "value": "Must have at least 1 property.",
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
                      "value": "Must not exceed 4 properties.",
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
                      "value": "When \`meta\` is present, must also include:",
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
                              "value": "\`status\`",
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
      ]
    `);
  });

  it("renders fallback content when no properties exist", () => {
    const schema: JsonSchema = {
      type: "object",
    };
    const result = renderObject(schema, { name: "empty" }, "$", {
      getResult: () => undefined,
      getContext: () => undefined,
    });
    expect(result.blocks).toEqual([
      paragraphFromText("No defined properties."),
    ]);
    expect(result.summarySuffix).toEqual([
      { type: "text", value: " - no defined properties" },
    ]);
  });

  it("exposes internals for property detail rendering", () => {
    const helpers: SchemaRendererHelpers = {
      getResult: (path) =>
        path.endsWith(".properties.field")
          ? {
              inline: [
                { type: "inlineCode", value: "field" },
                { type: "text", value: " detail" },
              ],
              blocks: [],
            }
          : undefined,
      getContext: () => ({ name: "field" }),
    };

    const paragraph = __objectInternals.renderPropertyDetails(
      "$",
      "field",
      helpers,
      {},
    );
    expect(paragraph).toEqual({
      type: "paragraph",
      children: [{ type: "text", value: " detail" }],
    });

    const inline = [
      { type: "inlineCode", value: "field" },
      { type: "text", value: " retained" },
    ];
    expect(__objectInternals.removeLeadingName(inline, "field")).toEqual([
      { type: "text", value: " retained" },
    ]);
  });
});
