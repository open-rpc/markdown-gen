---
title: "Filter"
description: "Schema definition for Filter."
sidebar_label: "Filter"
schema_name: "Filter"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Filter

---

## JSON Schema

```json
{
  "title": "filter",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fromBlock": {
      "title": "from block",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "toBlock": {
      "title": "to block",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "address": {
      "title": "Address(es)",
      "oneOf": [
        {
          "title": "Any Address",
          "type": "null"
        },
        {
          "title": "Address",
          "type": "string",
          "pattern": "^0x[0-9a-fA-F]{40}$"
        },
        {
          "title": "Addresses",
          "type": "array",
          "items": {
            "title": "hex encoded address",
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]{40}$"
          }
        }
      ]
    },
    "topics": {
      "title": "Topics",
      "oneOf": [
        {
          "title": "Any Topic Match",
          "type": "null"
        },
        {
          "title": "Specified Filter Topics",
          "type": "array",
          "items": {
            "title": "Filter Topic List Entry",
            "oneOf": [
              {
                "title": "Single Topic Match",
                "type": "string",
                "pattern": "^0x[0-9a-f]{64}$"
              },
              {
                "title": "Multiple Topic Match",
                "type": "array",
                "items": {
                  "title": "32 hex encoded bytes",
                  "type": "string",
                  "pattern": "^0x[0-9a-f]{64}$"
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| fromBlock | `string` | no |  |
| toBlock | `string` | no |  |
| address | `oneOf` | no |  |
| topics | `oneOf` | no |  |

