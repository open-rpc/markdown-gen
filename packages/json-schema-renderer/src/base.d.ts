import type { Content, ListItem, PhrasingContent } from "mdast";
import type { JsonSchema, JsonSchemaType, SchemaRenderContext } from "./types";
export declare function buildBaseSummary(schema: JsonSchema, context: SchemaRenderContext, normalizedType: JsonSchemaType | undefined): PhrasingContent[];
export declare function buildCommonBlocks(schema: JsonSchema): Content[];
export declare function buildGenericConstraintBlocks(schema: JsonSchema): Content[];
export declare function buildConstraintSection(title: string, items: ListItem[]): Content[];
//# sourceMappingURL=base.d.ts.map