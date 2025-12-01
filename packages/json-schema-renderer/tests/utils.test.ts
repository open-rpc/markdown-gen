import { describe, expect, it } from "bun:test";

import { formatValue } from "../src/utils.ts";

describe("utils", () => {
  it("falls back to String when JSON serialization fails", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(formatValue(circular)).toBe("[object Object]");
  });
});
