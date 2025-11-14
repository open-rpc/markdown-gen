---
title: "ForkchoiceUpdatedResponseV1"
description: "Schema definition for ForkchoiceUpdatedResponseV1."
sidebar_label: "ForkchoiceUpdatedResponseV1"
schema_name: "ForkchoiceUpdatedResponseV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ForkchoiceUpdatedResponseV1

---

## JSON Schema

```json
{
  "title": "Forkchoice updated response",
  "type": "object",
  "required": [
    "payloadStatus"
  ],
  "properties": {
    "payloadStatus": {
      "title": "Payload status",
      "type": "object",
      "required": [
        "status"
      ],
      "properties": {
        "status": {
          "$ref": "#/components/schemas/PayloadStatusV1/properties/status",
          "description": "Set of possible values is restricted to VALID, INVALID, SYNCING",
          "enum": [
            "VALID",
            "INVALID",
            "SYNCING"
          ]
        },
        "latestValidHash": {
          "$ref": "#/components/schemas/PayloadStatusV1/properties/latestValidHash"
        },
        "validationError": {
          "$ref": "#/components/schemas/PayloadStatusV1/properties/validationError"
        }
      }
    },
    "payloadId": {
      "title": "Payload id",
      "type": "string",
      "pattern": "^0x[0-9a-f]{16}$"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| payloadStatus | `object` | yes |  |
| payloadId | `string` | no |  |

