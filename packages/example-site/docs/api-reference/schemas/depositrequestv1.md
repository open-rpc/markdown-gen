---
title: "DepositRequestV1"
description: "Schema definition for DepositRequestV1."
sidebar_label: "DepositRequestV1"
schema_name: "DepositRequestV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# DepositRequestV1

---

## JSON Schema

```json
{
  "title": "Deposit request object V1",
  "type": "object",
  "required": [
    "pubkey",
    "withdrawalCredentials",
    "amount",
    "signature",
    "index"
  ],
  "properties": {
    "pubkey": {
      "title": "Public key",
      "type": "string",
      "pattern": "^0x[0-9a-f]{96}$"
    },
    "withdrawalCredentials": {
      "title": "Withdrawal credentials",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "amount": {
      "title": "Deposit amount",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "signature": {
      "title": "Deposit signature",
      "type": "string",
      "pattern": "^0x[0-9a-f]{192}$"
    },
    "index": {
      "title": "Deposit index",
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
| pubkey | `string` | yes |  |
| withdrawalCredentials | `string` | yes |  |
| amount | `string` | yes |  |
| signature | `string` | yes |  |
| index | `string` | yes |  |

