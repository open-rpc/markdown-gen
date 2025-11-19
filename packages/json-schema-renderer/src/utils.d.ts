import type { BlockContent, Heading, InlineCode, List, ListItem, Paragraph, PhrasingContent, TableCell, TableRow, Text } from "mdast";
export declare function text(value: string): Text;
export declare function inlineCode(value: string): InlineCode;
export declare function paragraphFromText(value: string): Paragraph;
export declare function paragraphFromPhrasing(children: PhrasingContent[]): Paragraph;
export declare function tableRow(cells: TableCell[]): TableRow;
export declare function tableCell(children: PhrasingContent[]): TableCell;
export declare function textCell(value: string): TableCell;
export declare function headingFromText(depth: Heading["depth"], value: string): Heading;
export declare function unorderedList(items: ListItem[]): List;
export declare function listItem(children: BlockContent[]): ListItem;
export declare function listItemFromText(value: string): ListItem;
export declare function formatValue(value: unknown): string;
//# sourceMappingURL=utils.d.ts.map