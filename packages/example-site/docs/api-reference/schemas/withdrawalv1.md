---
title: "WithdrawalV1"
description: "Schema definition for WithdrawalV1."
sidebar_label: "WithdrawalV1"
schema_name: "WithdrawalV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# WithdrawalV1

---

## JSON Schema

```json
{
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
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| index | `string` | yes |  |
| validatorIndex | `string` | yes |  |
| address | `string` | yes |  |
| amount | `string` | yes |  |

