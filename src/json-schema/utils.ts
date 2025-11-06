import type {
  Content,
  Heading,
  InlineCode,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  TableCell,
  TableRow,
  Text,
} from "mdast";

export function text(value: string): Text {
  return {
    type: "text",
    value,
  };
}

export function inlineCode(value: string): InlineCode {
  return {
    type: "inlineCode",
    value,
  };
}

export function paragraphFromText(value: string): Paragraph {
  return {
    type: "paragraph",
    children: [text(value)],
  };
}

export function paragraphFromPhrasing(
  children: PhrasingContent[],
): Paragraph {
  return {
    type: "paragraph",
    children,
  };
}

export function tableRow(cells: TableCell[]): TableRow {
  return {
    type: "tableRow",
    children: cells,
  };
}

export function tableCell(children: PhrasingContent[]): TableCell {
  return {
    type: "tableCell",
    children,
  };
}

export function textCell(value: string): TableCell {
  return tableCell([text(value)]);
}

export function headingFromText(depth: number, value: string): Heading {
  return {
    type: "heading",
    depth,
    children: [text(value)],
  };
}

export function unorderedList(items: ListItem[]): List {
  return {
    type: "list",
    ordered: false,
    spread: false,
    children: items,
  };
}

export function listItem(children: Content[]): ListItem {
  return {
    type: "listItem",
    spread: false,
    children,
  };
}

export function listItemFromText(value: string): ListItem {
  return listItem([paragraphFromText(value)]);
}

export function formatValue(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
