---
title: "AccessListEntry"
description: "Schema definition for AccessListEntry."
sidebar_label: "AccessListEntry"
schema_name: "AccessListEntry"
tags:
  - json-rpc
  - openrpc
  - schema
---

# AccessListEntry

---

## JSON Schema

```json
{
  "title": "Access list entry",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "address": {
      "title": "hex encoded address",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    },
    "storageKeys": {
      "type": "array",
      "items": {
        "title": "32 byte hex value",
        "type": "string",
        "pattern": "^0x[0-9a-f]{64}$"
      }
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| address | `string` | no |  |
| storageKeys | `string[]` | no |  |

