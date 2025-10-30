import { describe, expect, test } from "bun:test";

import type { OpenRPCDocument } from "./index";
import { generateMarkdownFromOpenRPC } from "./index";

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

      | Name | Type   | Description                               |
      | ---- | ------ | ----------------------------------------- |
      | pet  | object | \`pet\` (object) - Pet to add to the store. |

      #### Result

      \`pet\` (object) - The created pet.
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
});
