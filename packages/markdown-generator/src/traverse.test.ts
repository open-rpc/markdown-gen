import { describe, expect, it } from "bun:test";
import executionApis from "../../example-site/execution-apis.json";
import { traverseDocument, traverseSchemaObject } from "./traverse";
import type { DereffedOpenrpcDocument, NoRefs } from "./type";
import type { JSONSchema } from "@open-rpc/meta-schema";
import { allDraft7Fixtures } from "./fixtures";
describe("traverse", () => {
  it("should traverse a document", () => {
    traverseDocument(executionApis as unknown as DereffedOpenrpcDocument);
  });

  it("should not crash on a schema object", () => {
    Object.values(allDraft7Fixtures)
      .flat()
      .forEach((fixture) => {
        console.log(fixture.description);
        traverseSchemaObject(fixture.schema as NoRefs<JSONSchema>);
      });
  });

  it.only("should render allOf", () => {
    const allOf = allDraft7Fixtures.allOf;
    traverseSchemaObject(allOf.schema as NoRefs<JSONSchema>);
  });
});
