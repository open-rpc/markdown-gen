---
title: "RestrictedPayloadStatusV1"
description: "Schema definition for RestrictedPayloadStatusV1."
sidebar_label: "RestrictedPayloadStatusV1"
schema_name: "RestrictedPayloadStatusV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# RestrictedPayloadStatusV1

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
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| status | `status` | yes | Set of possible values is restricted to VALID, INVALID, SYNCING |
| latestValidHash | `latestValidHash` | no |  |
| validationError | `validationError` | no |  |

