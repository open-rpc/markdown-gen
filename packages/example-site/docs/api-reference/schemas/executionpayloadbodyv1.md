---
title: "ExecutionPayloadBodyV1"
description: "Schema definition for ExecutionPayloadBodyV1."
sidebar_label: "ExecutionPayloadBodyV1"
schema_name: "ExecutionPayloadBodyV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ExecutionPayloadBodyV1

---

## JSON Schema

```json
{
  "title": "Execution payload body object V1",
  "type": "object",
  "required": [
    "transactions"
  ],
  "properties": {
    "transactions": {
      "title": "Transactions",
      "type": "array",
      "items": {
        "title": "hex encoded bytes",
        "type": "string",
        "pattern": "^0x[0-9a-f]*$"
      }
    },
    "withdrawals": {
      "title": "Withdrawals",
      "type": [
        "array",
        "null"
      ],
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
| transactions | `string[]` | yes |  |
| withdrawals | `array,null` | no |  |

