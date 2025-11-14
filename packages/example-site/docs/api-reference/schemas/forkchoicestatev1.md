---
title: "ForkchoiceStateV1"
description: "Schema definition for ForkchoiceStateV1."
sidebar_label: "ForkchoiceStateV1"
schema_name: "ForkchoiceStateV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ForkchoiceStateV1

---

## JSON Schema

```json
{
  "title": "Forkchoice state object V1",
  "type": "object",
  "required": [
    "headBlockHash",
    "safeBlockHash",
    "finalizedBlockHash"
  ],
  "properties": {
    "headBlockHash": {
      "title": "Head block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "safeBlockHash": {
      "title": "Safe block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "finalizedBlockHash": {
      "title": "Finalized block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| headBlockHash | `string` | yes |  |
| safeBlockHash | `string` | yes |  |
| finalizedBlockHash | `string` | yes |  |

