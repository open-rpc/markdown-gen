import { test, expect } from "bun:test";

import { foo } from "./index";

test("test", () => {
  expect(foo()).toBe("foo");
});
