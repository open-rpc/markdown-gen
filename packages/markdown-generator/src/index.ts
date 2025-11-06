import { unified } from "unified";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import type {
  Content,
  Heading,
  InlineCode,
  Paragraph,
  PhrasingContent,
  Root,
  Table,
  TableCell,
  TableRow,
  Text,
} from "mdast";
import { renderSchema } from "./json-schema";
import type { SchemaRenderResult, JsonSchema } from "./json-schema";

export interface OpenRPCInfo {
  title?: string;
  description?: string;
  version?: string;
}

export type OpenRPCSchema = JsonSchema;

export interface OpenRPCContentDescriptor {
  name?: string;
  summary?: string;
  description?: string;
  schema?: OpenRPCSchema;
}

export interface OpenRPCMethod {
  name: string;
  summary?: string;
  description?: string;
  params?: OpenRPCContentDescriptor[];
  result?: OpenRPCContentDescriptor;
}

export interface OpenRPCDocument {
  info?: OpenRPCInfo;
  methods?: OpenRPCMethod[];
}

export async function generateMarkdownFromOpenRPC(
  document: OpenRPCDocument,
): Promise<string> {
  const tree = toMarkdownAst(document);
  const processor = unified().use(remarkGfm).use(remarkStringify, {
    fences: true,
    listItemIndent: "1",
    bullet: "-",
  });

  const processed = await processor.run(tree);
  return processor.stringify(processed);
}

function toMarkdownAst(document: OpenRPCDocument): Root {
  const children: Content[] = [];

  const title = document.info?.title ?? "OpenRPC Document";
  children.push(heading(1, text(title)));

  if (document.info?.description) {
    children.push(paragraphFromText(document.info.description));
  }

  if (document.info?.version) {
    children.push(paragraphFromText(`Version: ${document.info.version}`));
  }

  const methods = document.methods ?? [];
  if (methods.length > 0) {
    children.push(heading(2, text("Methods")));
  }

  for (const method of methods) {
    children.push(heading(3, text(method.name)));

    const methodSummary = method.summary ?? method.description;
    if (methodSummary) {
      children.push(paragraphFromText(methodSummary));
    }

    if (method.params && method.params.length > 0) {
      children.push(heading(4, text("Parameters")));
      children.push(parameterTable(method.params));
    }

    if (method.result) {
      children.push(heading(4, text("Result")));
      const renderedResult = renderDescriptor(method.result, "result");

      if (renderedResult.inline.length > 0) {
        children.push(paragraphFromPhrasing(renderedResult.inline));
      }

      if (renderedResult.blocks.length > 0) {
        children.push(...renderedResult.blocks);
      }
    }
  }

  return {
    type: "root",
    children,
  };
}

function paragraphFromText(value: string): Paragraph {
  return {
    type: "paragraph",
    children: [text(value)],
  };
}

function paragraphFromPhrasing(children: PhrasingContent[]): Paragraph {
  return {
    type: "paragraph",
    children,
  };
}

function heading(depth: number, child: Text): Heading {
  return {
    type: "heading",
    depth,
    children: [child],
  };
}

function text(value: string): Text {
  return {
    type: "text",
    value,
  };
}

function inlineCode(value: string): InlineCode {
  return {
    type: "inlineCode",
    value,
  };
}

function parameterTable(descriptors: OpenRPCContentDescriptor[]): Table {
  const headerRow = tableRow([
    textCell("Name"),
    textCell("Type"),
    textCell("Description"),
  ]);
  const rows = descriptors.map((descriptor, index) => {
    const fallbackName = `param${index + 1}`;
    const displayName = descriptorDisplayName(descriptor, fallbackName);
    const renderedDescriptor = renderDescriptor(descriptor, fallbackName);

    return tableRow([
      textCell(displayName),
      textCell(schemaTypeLabel(descriptor.schema)),
      descriptorCell(renderedDescriptor),
    ]);
  });
  return {
    type: "table",
    align: [null, null, null],
    children: [headerRow, ...rows],
  };
}

function tableRow(cells: TableCell[]): TableRow {
  return {
    type: "tableRow",
    children: cells,
  };
}

function textCell(value: string): TableCell {
  return {
    type: "tableCell",
    children: [text(value)],
  };
}

function descriptorCell(renderedDescriptor: SchemaRenderResult): TableCell {
  const children =
    renderedDescriptor.inline.length > 0
      ? renderedDescriptor.inline
      : [text("unknown")];
  return {
    type: "tableCell",
    children,
  };
}

function descriptorDisplayName(
  descriptor: OpenRPCContentDescriptor,
  fallbackName: string,
): string {
  const name = descriptor.name?.trim();
  return name && name.length > 0 ? name : fallbackName;
}

function renderDescriptor(
  descriptor: OpenRPCContentDescriptor,
  fallbackName: string,
): SchemaRenderResult {
  const name = descriptorDisplayName(descriptor, fallbackName);
  const schemaResult = renderSchema(descriptor.schema, { name });
  const inline =
    schemaResult.inline.length > 0
      ? [...schemaResult.inline]
      : [inlineCode(name), text(" (unknown)")];

  const descriptorSummaryText =
    descriptor.summary ?? descriptor.description ?? "";
  const summaryText = descriptorSummaryText.trim();

  if (summaryText.length > 0) {
    inline.push(text(` - ${summaryText}`));
  }

  return {
    inline,
    blocks: [...schemaResult.blocks],
  };
}

function schemaTypeLabel(schema: OpenRPCSchema | undefined): string {
  if (!schema?.type) {
    return "unknown";
  }

  return Array.isArray(schema.type) ? schema.type.join(" | ") : schema.type;
}
