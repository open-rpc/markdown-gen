---
title: "StorageProof"
description: "Schema definition for StorageProof."
sidebar_label: "StorageProof"
schema_name: "StorageProof"
tags:
  - json-rpc
  - openrpc
  - schema
---

# StorageProof

---

## JSON Schema

```json
{
  "title": "Storage proof",
  "type": "object",
  "required": [
    "key",
    "value",
    "proof"
  ],
  "additionalProperties": false,
  "properties": {
    "key": {
      "title": "key",
      "type": "string",
      "pattern": "^0x[0-9a-f]{0,64}$"
    },
    "value": {
      "title": "value",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,31})|0$"
    },
    "proof": {
      "title": "proof",
      "type": "array",
      "items": {
        "title": "hex encoded bytes",
        "type": "string",
        "pattern": "^0x[0-9a-f]*$"
      }
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| key | `string` | yes |  |
| value | `string` | yes |  |
| proof | `string[]` | yes |  |

