---
title: "PayloadStatusV1"
description: "Schema definition for PayloadStatusV1."
sidebar_label: "PayloadStatusV1"
schema_name: "PayloadStatusV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# PayloadStatusV1

---

## JSON Schema

```json
{
  "title": "Payload status object V1",
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "title": "Payload validation status",
      "type": "string",
      "enum": [
        "VALID",
        "INVALID",
        "SYNCING",
        "ACCEPTED",
        "INVALID_BLOCK_HASH"
      ]
    },
    "latestValidHash": {
      "title": "The hash of the most recent valid block",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "validationError": {
      "title": "Validation error message",
      "type": "string"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| status | `string` | yes |  |
| latestValidHash | `string` | no |  |
| validationError | `string` | no |  |

