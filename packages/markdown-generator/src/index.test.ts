import { describe, expect, test } from "bun:test";

import type { OpenRPCDocument } from "./index";
import { generateMarkdownFromOpenRPC, __internals } from "./index";

describe("generateMarkdownFromOpenRPC", () => {
  test("creates a markdown document for an OpenRPC spec", async () => {
    const document: OpenRPCDocument = {
      info: {
        title: "Pet Store",
        description: "Interact with the virtual pet store.",
        version: "1.0.0",
      },
      methods: [
        {
          name: "listPets",
          summary: "List all pets registered in the store.",
          params: [
            {
              name: "limit",
              summary: "How many items to return at one time (max 100).",
              schema: { type: "integer" },
            },
          ],
          result: {
            name: "pets",
            summary: "A collection of pets.",
            schema: { type: "array" },
          },
        },
        {
          name: "createPet",
          description: "Create a new pet in the store.",
          params: [
            {
              name: "pet",
              description: "Pet to add to the store.",
              schema: { type: "object" },
            },
          ],
          result: {
            name: "pet",
            summary: "The created pet.",
            schema: { type: "object" },
          },
        },
      ],
    };

    const markdown = await generateMarkdownFromOpenRPC(document);

    expect(markdown).toMatchInlineSnapshot(`
      "# Pet Store

      Interact with the virtual pet store.

      Version: 1.0.0

      ## Methods

      ### listPets

      List all pets registered in the store.

      #### Parameters

      | Name  | Type    | Description                                                         |
      | ----- | ------- | ------------------------------------------------------------------- |
      | limit | integer | \`limit\` (integer) - How many items to return at one time (max 100). |

      #### Result

      \`pets\` (array) - A collection of pets.

      ### createPet

      Create a new pet in the store.

      #### Parameters

      | Name | Type   | Description                                                       |
      | ---- | ------ | ----------------------------------------------------------------- |
      | pet  | object | \`pet\` (object) - no defined properties - Pet to add to the store. |

      #### Result

      \`pet\` (object) - no defined properties - The created pet.

      No defined properties.
      "
    `);
  });

  test("falls back to defaults when info is missing", async () => {
    const document: OpenRPCDocument = {
      methods: [
        {
          name: "ping",
          result: {
            name: "pong",
            schema: { type: "string" },
          },
        },
      ],
    };

    const markdown = await generateMarkdownFromOpenRPC(document);

    expect(markdown.startsWith("# OpenRPC Document")).toBe(true);
    expect(markdown).toContain("### ping");
    expect(markdown).toContain("`pong` (string)");
  });

  test("renders parameter entries even when schema information is missing", async () => {
    const document: OpenRPCDocument = {
      methods: [
        {
          name: "echo",
          params: [
            {
              name: "payload",
              summary: "Opaque input.",
            },
          ],
          result: {
            name: "response",
          },
        },
      ],
    };

    const markdown = await generateMarkdownFromOpenRPC(document);
    expect(markdown).toContain("`payload` (unknown) - Opaque input.");
    expect(markdown).toContain("`response` (unknown)");
  });

  test("inline helper produces mdast inline code nodes", () => {
    expect(__internals.inlineCode("token")).toEqual({
      type: "inlineCode",
      value: "token",
    });
  });
});
