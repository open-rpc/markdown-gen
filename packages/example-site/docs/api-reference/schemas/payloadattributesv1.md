---
title: "PayloadAttributesV1"
description: "Schema definition for PayloadAttributesV1."
sidebar_label: "PayloadAttributesV1"
schema_name: "PayloadAttributesV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# PayloadAttributesV1

---

## JSON Schema

```json
{
  "title": "Payload attributes object V1",
  "type": "object",
  "required": [
    "timestamp",
    "prevRandao",
    "suggestedFeeRecipient"
  ],
  "properties": {
    "timestamp": {
      "title": "Timestamp",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "prevRandao": {
      "title": "Previous randao value",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "suggestedFeeRecipient": {
      "title": "Suggested fee recipient",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| timestamp | `string` | yes |  |
| prevRandao | `string` | yes |  |
| suggestedFeeRecipient | `string` | yes |  |

