---
title: "Withdrawal"
description: "Schema definition for Withdrawal."
sidebar_label: "Withdrawal"
schema_name: "Withdrawal"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Withdrawal

---

## JSON Schema

```json
{
  "type": "object",
  "title": "Validator withdrawal",
  "required": [
    "index",
    "validatorIndex",
    "address",
    "amount"
  ],
  "additionalProperties": false,
  "properties": {
    "index": {
      "title": "index of withdrawal",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "validatorIndex": {
      "title": "index of validator that generated withdrawal",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "address": {
      "title": "recipient address for withdrawal value",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    },
    "amount": {
      "title": "value contained in withdrawal",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,31})|0$"
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

