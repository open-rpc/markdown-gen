import { describe, expect, it } from "bun:test";

import { __internals } from "../src/index.ts";
import type { SchemaRenderContext } from "../src/types.ts";

describe("index internals", () => {
  it("normalizes and derives schema paths", () => {
    const { normalizePath, splitPath, parentSchemaPath } = __internals;
    expect(normalizePath("")).toBe("$");
    expect(splitPath("$.properties.id")).toEqual(["$", "properties", "id"]);
    expect(parentSchemaPath("$.properties.id")).toBe("$");
    expect(parentSchemaPath("$")).toBeUndefined();
    expect(parentSchemaPath("solo")).toBe("$");
  });

  it("derives readable context names for various path patterns", () => {
    const { deriveContextName } = __internals;
    expect(deriveContextName("$.properties.user", undefined)).toBe("user");
    expect(deriveContextName("$.patternProperties.^x", "root")).toBe("^x");
    expect(deriveContextName("$.definitions.shared", "root")).toBe(
      "root shared",
    );
    expect(deriveContextName("$.items", "root")).toBe("root item");
    expect(deriveContextName("$.items[2]", "root")).toBe("root item 2");
    expect(deriveContextName("$.anyOf[1]", "root")).toBe("root option 2");
    expect(deriveContextName("$.allOf[0]", "root")).toBe("root requirement 1");
    expect(deriveContextName("$.contains", "root")).toBe("root contains");
    expect(deriveContextName("$.additionalProperties", "root")).toBe(
      "root additional property",
    );
    expect(deriveContextName("$.unevaluatedProperties", "root")).toBe(
      "root unevaluated property",
    );
    expect(deriveContextName("$.propertyNames", "root")).toBe(
      "root property names",
    );
    expect(deriveContextName("$.customField", undefined)).toBe("custom Field");
  });

  it("ensures contexts for paths, covering root derivation", () => {
    const { ensureContextForPath } = __internals;
    const map = new Map<string, SchemaRenderContext>();
    const context = { name: "root" };
    const root = ensureContextForPath("$", map, context);
    expect(root).toBe(context);

    const child = ensureContextForPath("$.properties.name", map, root);
    expect(child.name).toBe("name");
    expect(map.get("$")).toBe(context);
  });

  it("normalizes complex type arrays", () => {
    const { normalizeType } = __internals;
    expect(normalizeType(undefined)).toBeUndefined();
    expect(normalizeType(["integer", "null"])).toBe("integer");
  });
});
