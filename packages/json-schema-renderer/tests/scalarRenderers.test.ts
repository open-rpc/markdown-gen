import { describe, expect, it } from "bun:test";

import { renderString } from "../src/string.ts";
import { renderNumber } from "../src/number.ts";
import { renderBoolean } from "../src/boolean.ts";
import type { JsonSchema } from "../src/types.ts";

describe("scalar renderers", () => {
  it("renders string constraints including maximum length", () => {
    const schema: JsonSchema = {
      type: "string",
      format: "email",
      enum: ["a"],
      pattern: "\\w+",
      minLength: 1,
      maxLength: 5,
    };

    const result = renderString(schema, { name: "email" }, "$", {
      getContext: () => undefined,
      getResult: () => undefined,
    });

    expect(result.summarySuffix).toEqual([
      { type: "text", value: " format: email" },
      { type: "text", value: " - 1 allowed value" },
    ]);

    expect(result.blocks).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "type": "text",
              "value": "String Constraints",
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
                      "value": "Must match the regular expression \`\\w+\`.",
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
                      "value": "Must be at least 1 character long.",
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
                      "value": "Must not exceed 5 characters in length.",
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

  it("renders numeric enums and constraint combinations", () => {
    const schema: JsonSchema = {
      type: "number",
      enum: [1, 2, 3],
      multipleOf: 0.5,
      minimum: 1,
      exclusiveMinimum: 2,
      maximum: 10,
      exclusiveMaximum: 9,
    };

    const result = renderNumber(
      schema,
      { name: "score" },
      "$",
      {
        getContext: () => undefined,
        getResult: () => undefined,
      },
      "number",
    );

    expect(result.summarySuffix).toEqual([
      { type: "text", value: " - 3 allowed values" },
    ]);
    expect(result.blocks).toMatchInlineSnapshot(`
      [
        {
          "children": [
            {
              "type": "text",
              "value": "Number Constraints",
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
                      "value": "Must be a multiple of 0.5.",
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
                      "value": "Must be greater than or equal to 1.",
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
                      "value": "Must be strictly greater than 2.",
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
                      "value": "Must be less than or equal to 10.",
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
                      "value": "Must be strictly less than 9.",
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

  it("adds boolean description into the summary", () => {
    const schema: JsonSchema = {
      type: "boolean",
      description: " Indicates whether the flag is enabled. ",
    };

    const result = renderBoolean(schema, { name: "flag" }, "$", {
      getContext: () => undefined,
      getResult: () => undefined,
    });

    expect(result.summarySuffix).toEqual([
      { type: "text", value: " - Indicates whether the flag is enabled." },
    ]);
  });
});
