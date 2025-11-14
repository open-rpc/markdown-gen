---
title: "ConsolidationRequestV1"
description: "Schema definition for ConsolidationRequestV1."
sidebar_label: "ConsolidationRequestV1"
schema_name: "ConsolidationRequestV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ConsolidationRequestV1

---

## JSON Schema

```json
{
  "title": "Consolidation request object V1",
  "type": "object",
  "required": [
    "sourceAddress",
    "sourcePubkey",
    "targetPubkey"
  ],
  "properties": {
    "sourceAddress": {
      "title": "Source address",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    },
    "sourcePubkey": {
      "title": "Source validator public key",
      "type": "string",
      "pattern": "^0x[0-9a-f]{96}$"
    },
    "targetPubkey": {
      "title": "Target validator public key",
      "type": "string",
      "pattern": "^0x[0-9a-f]{96}$"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| sourceAddress | `string` | yes |  |
| sourcePubkey | `string` | yes |  |
| targetPubkey | `string` | yes |  |

