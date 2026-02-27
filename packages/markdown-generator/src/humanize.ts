import type { JSONSchema } from "./type";
import type { NoRefs, OpenRPCMdContent } from "./type";
import type { PhrasingContent } from "mdast";

// ─────────────────────────────────────────────────────────────
// String constraints
// ─────────────────────────────────────────────────────────────

export function humanizeStringLength(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object") return [];
  const { minLength, maxLength } = schema;
  if (minLength === undefined && maxLength === undefined) return [];

  let text: string;
  if (minLength !== undefined && maxLength !== undefined) {
    text =
      minLength === maxLength
        ? `exactly ${minLength} chars`
        : `${minLength}–${maxLength} chars`;
  } else if (minLength !== undefined) {
    text = `>= ${minLength} chars`;
  } else {
    text = `<= ${maxLength} chars`;
  }

  return [
    {
      type: "paragraph",
      children: [{ type: "inlineCode", value: text }],
    },
  ];
}

export function humanizePattern(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || !schema.pattern) return [];
  return [
    {
      type: "paragraph",
      children: [
        {
          type: "emphasis",
          children: [{ type: "text", value: "Match pattern:" }],
        },
        { type: "text", value: " " },
        { type: "inlineCode", value: schema.pattern },
      ],
    },
  ];
}

export function humanizeFormat(schema: NoRefs<JSONSchema>): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || !schema.format) return [];
  return [
    {
      type: "paragraph",
      children: [
        { type: "emphasis", children: [{ type: "text", value: "Format:" }] },
        { type: "text", value: ` ${schema.format.toUpperCase()}` },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Number/Integer constraints
// ─────────────────────────────────────────────────────────────

export function humanizeNumberRange(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object") return [];

  const min = schema.minimum;
  const max = schema.maximum;
  const exMin = schema.exclusiveMinimum;
  const exMax = schema.exclusiveMaximum;

  const hasMin = min !== undefined || exMin !== undefined;
  const hasMax = max !== undefined || exMax !== undefined;

  if (!hasMin && !hasMax) return [];

  const minOp = exMin !== undefined ? ">" : ">=";
  const maxOp = exMax !== undefined ? "<" : "<=";
  const minVal = exMin ?? min;
  const maxVal = exMax ?? max;

  let text: string;
  if (hasMin && hasMax) {
    // Combined range
    text = `${minOp} ${minVal} and ${maxOp} ${maxVal}`;
  } else if (hasMin) {
    text = `${minOp} ${minVal}`;
  } else {
    text = `${maxOp} ${maxVal}`;
  }

  return [
    {
      type: "paragraph",
      children: [
        { type: "text", value: `Range:` },
        { type: "text", value: ` ` },
        { type: "inlineCode", value: text },
      ],
    },
  ];
}

export function humanizeMultipleOf(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || schema.multipleOf === undefined)
    return [];
  return [
    {
      type: "paragraph",
      children: [
        {
          type: "emphasis",
          children: [{ type: "text", value: "Multiple of:" }],
        },
        { type: "text", value: " " },
        { type: "inlineCode", value: String(schema.multipleOf) },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Enum / Const
// ─────────────────────────────────────────────────────────────

export function humanizeEnum(schema: NoRefs<JSONSchema>): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || !schema.enum?.length) return [];

  const enumCodes: PhrasingContent[] = schema.enum.flatMap((val, idx) => {
    const code: PhrasingContent = { type: "inlineCode", value: String(val) };
    return idx < schema.enum!.length - 1
      ? [code, { type: "text", value: " " }]
      : [code];
  });

  return [
    {
      type: "paragraph",
      children: [
        {
          type: "emphasis",
          children: [{ type: "text", value: "Allowed values:" }],
        },
        { type: "text", value: " " },
        ...enumCodes,
      ],
    },
  ];
}

export function humanizeConst(schema: NoRefs<JSONSchema>): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || schema.const === undefined)
    return [];
  return [
    {
      type: "paragraph",
      children: [
        { type: "emphasis", children: [{ type: "text", value: "Must be:" }] },
        { type: "text", value: " " },
        { type: "inlineCode", value: JSON.stringify(schema.const) },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Array constraints
// ─────────────────────────────────────────────────────────────

export function humanizeArrayLength(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object") return [];
  const { minItems, maxItems } = schema;
  if (minItems === undefined && maxItems === undefined) return [];

  let text: string;
  if (minItems !== undefined && maxItems !== undefined) {
    text =
      minItems === maxItems
        ? `exactly ${minItems} items`
        : `${minItems}–${maxItems} items`;
  } else if (minItems !== undefined) {
    text = `>= ${minItems} items`;
  } else {
    text = `<= ${maxItems} items`;
  }

  return [
    {
      type: "paragraph",
      children: [{ type: "inlineCode", value: text }],
    },
  ];
}

export function humanizeUniqueItems(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || !schema.uniqueItems) return [];
  return [
    {
      type: "paragraph",
      children: [
        {
          type: "emphasis",
          children: [{ type: "text", value: "Unique items" }],
        },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Default value
// ─────────────────────────────────────────────────────────────

export function humanizeDefault(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[] {
  if (!schema || typeof schema !== "object" || schema.default === undefined)
    return [];
  return [
    {
      type: "paragraph",
      children: [
        { type: "emphasis", children: [{ type: "text", value: "Default:" }] },
        { type: "text", value: " " },
        { type: "inlineCode", value: JSON.stringify(schema.default) },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Aggregate: returns OpenRPCMdContent[][] for each category
// ─────────────────────────────────────────────────────────────

export function humanizeSchemaConstraints(
  schema: NoRefs<JSONSchema>,
): OpenRPCMdContent[][] {
  if (!schema || typeof schema !== "object") return [];

  return [
    // String
    humanizeStringLength(schema),
    humanizePattern(schema),
    humanizeFormat(schema),
    // Number
    humanizeNumberRange(schema),
    humanizeMultipleOf(schema),
    // Enum/Const
    humanizeEnum(schema),
    humanizeConst(schema),
    // Array
    humanizeArrayLength(schema),
    humanizeUniqueItems(schema),
    // General
    humanizeDefault(schema),
  ].filter((arr) => arr.length > 0);
}
