import { describe, it, expect } from "bun:test";
import { renderMethod, identitySchemaEdits, identityEdits } from "../schema";
import { renderMethodsToMarkdown, renderIndex, tagPermalinkPrefixForDocOutputPath } from "../lib";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmToMarkdown } from "mdast-util-gfm";
import { mdxToMarkdown } from "mdast-util-mdx";
import { frontmatterToMarkdown } from "mdast-util-frontmatter";
import type { Root } from "mdast";
import type { DereffedMethodObject, DereffedOpenrpcDocument } from "../type";
import type { OpenrpcDocument } from "../type";
import comprehensiveTestDoc from "./comprehensive-test-openrpc.json";

const testDoc = comprehensiveTestDoc as unknown as OpenrpcDocument;

describe("comprehensive schema fixtures test", () => {
  it("should render all methods without crashing", () => {
    const methods = comprehensiveTestDoc.methods as DereffedMethodObject[];

    for (const method of methods) {
      // This test ensures renderMethod doesn't crash on any valid schema permutation
      const result = renderMethod(method, identitySchemaEdits, identityEdits);

      // Basic validation - should return an array with content
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Should be able to convert to markdown without errors
      const rootDocument: Root = {
        type: "root",
        children: result,
      };

      const markdown = toMarkdown(rootDocument, {
        extensions: [gfmToMarkdown(), mdxToMarkdown(), frontmatterToMarkdown()],
      });

      expect(markdown).toBeDefined();
      expect(typeof markdown).toBe("string");
      expect(markdown.length).toBeGreaterThan(0);
    }
  });
});

describe("renderMethodsToMarkdown", () => {
  it("should return array of MethodToMarkdown objects for all methods", async () => {
    const results = await renderMethodsToMarkdown(
      testDoc,
      identitySchemaEdits,
      identityEdits,
    );

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(comprehensiveTestDoc.methods.length);
  });

  it("should produce objects with methodName and markdown properties", async () => {
    const results = await renderMethodsToMarkdown(
      testDoc,
      identitySchemaEdits,
      identityEdits,
    );

    for (const result of results) {
      expect(result).toHaveProperty("methodName");
      expect(result).toHaveProperty("markdown");
      expect(typeof result.methodName).toBe("string");
      expect(typeof result.markdown).toBe("string");
      expect(result.methodName.length).toBeGreaterThan(0);
      expect(result.markdown.length).toBeGreaterThan(0);
    }
  });

  it("should include frontmatter in markdown output", async () => {
    const results = await renderMethodsToMarkdown(
      testDoc,
      identitySchemaEdits,
      identityEdits,
    );

    for (const result of results) {
      // Frontmatter starts with ---
      expect(result.markdown.startsWith("---")).toBe(true);
      // Should contain title in frontmatter
      expect(result.markdown).toContain(`title: "${result.methodName}"`);
    }
  });

  it("should process all 25 methods from fixture", async () => {
    const results = await renderMethodsToMarkdown(
      testDoc,
      identitySchemaEdits,
      identityEdits,
    );

    const methodNames = results.map((r) => r.methodName);
    expect(methodNames).toContain("test_allOf_composition_param");
    expect(methodNames).toContain("test_anyOf_composition_result");
    expect(methodNames).toContain("test_if_then_else_keyword");
    expect(results.length).toBe(26);
  });
});

describe("renderIndex", () => {
  it("should generate index with title, version, and description", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "mdx");

    expect(index).toContain('title: "Comprehensive Schema Test"');
    expect(index).toContain("Version: `1.0.0`");
    expect(index).toContain(
      "Test document for validating renderMethod function",
    );
  });

  it("should not aggregate method tags into the index frontmatter", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "mdx");

    expect(index.startsWith("---")).toBe(true);
    const frontmatterEnd = index.indexOf("\n---", 3);
    expect(frontmatterEnd).toBeGreaterThan(0);
    const frontmatter = index.slice(0, frontmatterEnd);
    expect(frontmatter).not.toContain("tags:");
  });

  it("should render an mdx tag strip in the body when methods have tags", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "mdx");

    expect(index).toContain(
      "import TagsListInline from '@theme/TagsListInline';",
    );
    expect(index).toContain("<TagsListInline tags={[");
    expect(index).toContain(
      '{label: "composition", permalink: "./tags/composition"}',
    );
    expect(index).toContain('{label: "arrays", permalink: "./tags/arrays"}');
  });

  it("should use ../tags/ permalinks when index is nested under docs/", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "mdx", {}, "../tags/");

    expect(index).toContain(
      '{label: "composition", permalink: "../tags/composition"}',
    );
    expect(index).toContain('{label: "arrays", permalink: "../tags/arrays"}');
  });

  it("should derive tag permalink prefix from doc output path depth", () => {
    expect(tagPermalinkPrefixForDocOutputPath("./docs/api-reference")).toBe(
      "../tags/",
    );
    expect(tagPermalinkPrefixForDocOutputPath("docs")).toBe("./tags/");
    expect(tagPermalinkPrefixForDocOutputPath("./docs/foo/bar")).toBe(
      "../../tags/",
    );
  });

  it("should render a markdown tag line in the body when output is md", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "md");

    expect(index).not.toContain("TagsListInline");
    expect(index).toContain("**Tags:**");
    expect(index).toContain("[composition](./tags/composition)");
    expect(index).toContain("[arrays](./tags/arrays)");
  });

  it("should omit any tag block when no methods carry tags", () => {
    const untaggedDoc: DereffedOpenrpcDocument = {
      openrpc: "1.0.0",
      info: { title: "Untagged API", version: "1.0.0" },
      methods: [
        {
          name: "noop",
          params: [],
          result: { name: "ok", schema: {} },
        },
      ],
    } as DereffedOpenrpcDocument;

    const indexMdx = renderIndex(untaggedDoc, "mdx");
    const indexMd = renderIndex(untaggedDoc, "md");

    for (const out of [indexMdx, indexMd]) {
      expect(out).not.toContain("tags:");
      expect(out).not.toContain("TagsListInline");
      expect(out).not.toContain("**Tags:**");
      expect(out).not.toContain("./tags/");
    }
  });

  it("should list all methods with correct .mdx links", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "mdx");

    // Check method links
    expect(index).toContain(
      "[`test_allOf_composition_param`](./methods/test_allOf_composition_param.mdx)",
    );
    expect(index).toContain(
      "[`test_if_then_else_keyword`](./methods/test_if_then_else_keyword.mdx)",
    );
  });

  it("should use .md extension when markdownType is md", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "md");

    expect(index).toContain(
      "[`test_allOf_composition_param`](./methods/test_allOf_composition_param.md)",
    );
  });

  it("should handle empty methods array", () => {
    const emptyDoc: DereffedOpenrpcDocument = {
      openrpc: "1.0.0",
      info: { title: "Empty API", version: "1.0.0" },
      methods: [],
    };
    const index = renderIndex(emptyDoc, "mdx");

    expect(index).toContain('title: "Empty API"');
    expect(index).toContain("_No methods defined._");
  });

  it("should have Methods heading", () => {
    const doc = comprehensiveTestDoc as DereffedOpenrpcDocument;
    const index = renderIndex(doc, "mdx");

    expect(index).toContain("## Methods");
  });
});
