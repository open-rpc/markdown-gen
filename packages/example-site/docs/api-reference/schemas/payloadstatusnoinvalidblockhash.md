---
title: "PayloadStatusNoInvalidBlockHash"
description: "Schema definition for PayloadStatusNoInvalidBlockHash."
sidebar_label: "PayloadStatusNoInvalidBlockHash"
schema_name: "PayloadStatusNoInvalidBlockHash"
tags:
  - json-rpc
  - openrpc
  - schema
---

# PayloadStatusNoInvalidBlockHash

---

## JSON Schema

```json
{
  "title": "Payload status object deprecating INVALID_BLOCK_HASH status",
  "type": "object",
  "required": [
    "status"
  ],
  "properties": {
    "status": {
      "$ref": "#/components/schemas/PayloadStatusV1/properties/status",
      "enum": [
        "VALID",
        "INVALID",
        "SYNCING",
        "ACCEPTED"
      ]
    },
    "latestValidHash": {
      "$ref": "#/components/schemas/PayloadStatusV1/properties/latestValidHash"
    },
    "validationError": {
      "$ref": "#/components/schemas/PayloadStatusV1/properties/validationError"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| status | `status` | yes |  |
| latestValidHash | `latestValidHash` | no |  |
| validationError | `validationError` | no |  |

