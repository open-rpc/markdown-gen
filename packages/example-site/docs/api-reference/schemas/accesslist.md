---
title: "AccessList"
description: "Schema definition for AccessList."
sidebar_label: "AccessList"
schema_name: "AccessList"
tags:
  - json-rpc
  - openrpc
  - schema
---

# AccessList

---

## JSON Schema

```json
{
  "title": "Access list",
  "type": "array",
  "items": {
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
}
```

