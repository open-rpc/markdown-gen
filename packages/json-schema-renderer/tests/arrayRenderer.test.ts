import { describe, expect, it } from "bun:test";

import { renderArray } from "../src/array.ts";
import { paragraphFromText, text } from "../src/utils.ts";
import type {
  JsonSchema,
  SchemaRenderContext,
  SchemaRendererHelpers,
  SchemaRenderResult,
} from "../src/types.ts";

describe("renderArray", () => {
  const context: SchemaRenderContext = { name: "list" };

  it("handles tuples, helper content, and array constraints", () => {
    const schema: JsonSchema = {
      type: "array",
      items: [{ type: ["string", "null"] }, { type: "integer" }],
      minItems: 1,
      maxItems: 3,
      uniqueItems: true,
      contains: { type: "string" },
      minContains: 1,
      maxContains: 2,
    };

    const renderedItem: SchemaRenderResult = {
      inline: [
        { type: "inlineCode", value: "list item 1" },
        { type: "text", value: " (string)" },
      ],
      blocks: [paragraphFromText("tuple details")],
    };

    const helpers: SchemaRendererHelpers = {
      getResult: (path) =>
        path.endsWith("items[0]") ? renderedItem : undefined,
      getContext: (path) =>
        path.endsWith("items[0]") ? { name: "list item 1" } : undefined,
    };

    const result = renderArray(schema, context, "$", helpers);

    expect(result.summarySuffix).toEqual([
      { type: "text", value: " of string | null" },
    ]);
    expect(result.blocks).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "type": "text",
              "value": "Items: ",
            },
            {
              "type": "text",
              "value": " (string)",
            },
          ],
          "type": "paragraph",
        },
        {
          "children": [
            {
              "type": "text",
              "value": "tuple details",
            },
          ],
          "type": "paragraph",
        },
        {
          "children": [
            {
              "type": "text",
              "value": "Array Constraints",
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
                      "value": "Must contain at least 1 item.",
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
                      "value": "Must not contain more than 3 items.",
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
                      "value": "All items must be unique.",
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
                      "value": "Must contain items matching the defined schema.",
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
                              "value": "At least 1 matching item.",
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
                              "value": "At most 2 matching items.",
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

  it("handles arrays without defined items", () => {
    const schema: JsonSchema = {
      type: "array",
    };

    const helpers: SchemaRendererHelpers = {
      getResult: () => undefined,
      getContext: () => undefined,
    };

    const result = renderArray(schema, context, "$", helpers);
    expect(result.summarySuffix).toEqual([]);
    expect(result.blocks).toEqual([]);
  });

  it("preserves inline details when helper summary lacks inline code", () => {
    const schema: JsonSchema = {
      type: "array",
      items: { type: "number" },
    };
    const helpers: SchemaRendererHelpers = {
      getResult: () => ({
        inline: [text("value only")],
        blocks: [],
      }),
      getContext: () => ({ name: "numbers" }),
    };

    const result = renderArray(schema, context, "$", helpers);
    expect(result.blocks[0]).toEqual({
      type: "paragraph",
      children: [text("Items: "), text("value only")],
    });
  });
});
