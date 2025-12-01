import { describe, expect, it } from "bun:test";

import {
  buildBaseSummary,
  buildCommonBlocks,
  buildConstraintSection,
  buildGenericConstraintBlocks,
} from "../src/base.ts";
import type { JsonSchema } from "../src/types.ts";

describe("base renderer utilities", () => {
  it("builds base summaries with various type sources", () => {
    const context = { name: "example" };
    const explicit = buildBaseSummary({ type: "string" }, context, "string");
    expect(explicit).toEqual([
      { type: "inlineCode", value: "example" },
      { type: "text", value: " (string)" },
    ]);

    const inferred = buildBaseSummary(
      { type: ["integer", "null"] },
      context,
      undefined,
    );
    expect(inferred[1]).toEqual({ type: "text", value: " (integer | null)" });

    const unknown = buildBaseSummary({}, context, undefined);
    expect(unknown[1]).toEqual({ type: "text", value: " (unknown)" });

    const fallback = buildBaseSummary({ type: "boolean" }, context, undefined);
    expect(fallback[1]).toEqual({ type: "text", value: " (boolean)" });
  });

  it("builds common content blocks for description, defaults, and examples", () => {
    const schema: JsonSchema = {
      description: "  Trim me  ",
      default: { enabled: true },
      examples: [{ id: 1 }],
    };

    const blocks = buildCommonBlocks(schema);
    expect(blocks).toEqual([
      {
        type: "paragraph",
        children: [{ type: "text", value: "Trim me" }],
      },
      {
        type: "paragraph",
        children: [{ type: "text", value: 'Default: {"enabled":true}' }],
      },
      {
        type: "heading",
        depth: 5,
        children: [{ type: "text", value: "Examples" }],
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
                children: [{ type: "text", value: '{"id":1}' }],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("builds constraint blocks for enum and const values", () => {
    const schema: JsonSchema = {
      enum: ["a", "b"],
      const: "a",
    };

    const blocks = buildGenericConstraintBlocks(schema);
    expect(blocks).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "type": "text",
              "value": "Constraints",
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
                      "value": "Must be one of:",
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
                              "value": ""a"",
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
                              "value": ""b"",
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
                      "value": "Must always be "a".",
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
      ]
    `);
  });

  it("returns no constraint section if there are no items", () => {
    expect(buildConstraintSection("Empty", [])).toEqual([]);
  });
});
