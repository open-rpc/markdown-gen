import additionalProperties from "./draft7/additionalItems.json";
import additionalItems from "./draft7/additionalItems.json";
import allOf from "./draft7/allOf.json";
import anyOf from "./draft7/anyOf.json";
import draft7Const from "./draft7/const.json";
import draft7Contains from "./draft7/contains.json";
import draft7Default from "./draft7/default.json";
// definitions are not supported here all documents dereffed
import draft7Dependencies from "./draft7/dependencies.json";
import draft7Enum from "./draft7/enum.json";
import exclusiveMaximum from "./draft7/exclusiveMaximum.json";
import exclusiveMinimum from "./draft7/exclusiveMinimum.json";
import format from "./draft7/format.json";
import ifThenElse from "./draft7/if-then-else.json";
import items from "./draft7/items.json";
import maximum from "./draft7/maximum.json";
import maxItems from "./draft7/maxItems.json";
import maxLength from "./draft7/maxLength.json";
import maxProperties from "./draft7/maxProperties.json";
import minimum from "./draft7/minimum.json";
import minItems from "./draft7/minItems.json";
import minProperties from "./draft7/minProperties.json";
import minLength from "./draft7/minLength.json";
import multipleOf from "./draft7/multipleOf.json";
import not from "./draft7/not.json";
import oneOf from "./draft7/oneOf.json";
import pattern from "./draft7/pattern.json";
import patternProperties from "./draft7/patternProperties.json";
import properties from "./draft7/properties.json";
import propertyNames from "./draft7/propertyNames.json";
import required from "./draft7/required.json";
import draft7Type from "./draft7/type.json";
import uniqueItems from "./draft7/uniqueItems.json";

export const allDraft7Fixtures = {
  additionalProperties,
  additionalItems,
  allOf,
  anyOf,
  draft7Const,
  draft7Contains,
  draft7Default,
  draft7Dependencies,
  draft7Enum,
  exclusiveMaximum,
  exclusiveMinimum,
  format,
  ifThenElse,
  items,
  maximum,
  maxItems,
  maxLength,
  maxProperties,
  minimum,
  minItems,
  minProperties,
  minLength,
  multipleOf,
  not,
  oneOf,
  pattern,
  patternProperties,
  properties,
  propertyNames,
  required,
  draft7Type,
  uniqueItems,
};

export const allDraft7FixturesArray = Object.values(allDraft7Fixtures).flat();
