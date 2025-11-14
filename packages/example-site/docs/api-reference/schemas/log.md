---
title: "Log"
description: "Schema definition for Log."
sidebar_label: "Log"
schema_name: "Log"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Log

---

## JSON Schema

```json
{
  "title": "log",
  "type": "object",
  "required": [
    "transactionHash"
  ],
  "additionalProperties": false,
  "properties": {
    "removed": {
      "title": "removed",
      "type": "boolean"
    },
    "logIndex": {
      "title": "log index",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "transactionIndex": {
      "title": "transaction index",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "transactionHash": {
      "title": "transaction hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "blockHash": {
      "title": "block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "blockNumber": {
      "title": "block number",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "address": {
      "title": "address",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    },
    "data": {
      "title": "data",
      "type": "string",
      "pattern": "^0x[0-9a-f]*$"
    },
    "topics": {
      "title": "topics",
      "type": "array",
      "items": {
        "title": "32 hex encoded bytes",
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
| removed | `boolean` | no |  |
| logIndex | `string` | no |  |
| transactionIndex | `string` | no |  |
| transactionHash | `string` | yes |  |
| blockHash | `string` | no |  |
| blockNumber | `string` | no |  |
| address | `string` | no |  |
| data | `string` | no |  |
| topics | `string[]` | no |  |

