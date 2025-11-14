---
title: "PayloadAttributesV2"
description: "Schema definition for PayloadAttributesV2."
sidebar_label: "PayloadAttributesV2"
schema_name: "PayloadAttributesV2"
tags:
  - json-rpc
  - openrpc
  - schema
---

# PayloadAttributesV2

---

## JSON Schema

```json
{
  "title": "Payload attributes object V2",
  "type": "object",
  "required": [
    "timestamp",
    "prevRandao",
    "suggestedFeeRecipient",
    "withdrawals"
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
    },
    "withdrawals": {
      "title": "Withdrawals",
      "type": "array",
      "items": {
        "title": "Withdrawal object V1",
        "type": "object",
        "required": [
          "index",
          "validatorIndex",
          "address",
          "amount"
        ],
        "properties": {
          "index": {
            "title": "Withdrawal index",
            "type": "string",
            "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
          },
          "validatorIndex": {
            "title": "Validator index",
            "type": "string",
            "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
          },
          "address": {
            "title": "Withdrawal address",
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]{40}$"
          },
          "amount": {
            "title": "Withdrawal amount",
            "type": "string",
            "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
          }
        }
      }
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
| withdrawals | `object[]` | yes |  |

