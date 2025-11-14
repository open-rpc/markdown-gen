---
title: "WithdrawalRequestV1"
description: "Schema definition for WithdrawalRequestV1."
sidebar_label: "WithdrawalRequestV1"
schema_name: "WithdrawalRequestV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# WithdrawalRequestV1

---

## JSON Schema

```json
{
  "title": "Withdrawal request object V1",
  "type": "object",
  "required": [
    "sourceAddress",
    "validatorPubkey",
    "amount"
  ],
  "properties": {
    "sourceAddress": {
      "title": "Source address",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    },
    "validatorPubkey": {
      "title": "Validator public key",
      "type": "string",
      "pattern": "^0x[0-9a-f]{96}$"
    },
    "amount": {
      "title": "Withdraw amount",
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
| sourceAddress | `string` | yes |  |
| validatorPubkey | `string` | yes |  |
| amount | `string` | yes |  |

