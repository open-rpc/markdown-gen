---
title: "TransactionLegacyUnsigned"
description: "Schema definition for TransactionLegacyUnsigned."
sidebar_label: "TransactionLegacyUnsigned"
schema_name: "TransactionLegacyUnsigned"
tags:
  - json-rpc
  - openrpc
  - schema
---

# TransactionLegacyUnsigned

---

## JSON Schema

```json
{
  "type": "object",
  "title": "Legacy transaction.",
  "required": [
    "type",
    "nonce",
    "gas",
    "value",
    "input",
    "gasPrice"
  ],
  "properties": {
    "type": {
      "title": "type",
      "type": "string",
      "pattern": "^0x0$"
    },
    "nonce": {
      "title": "nonce",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "to": {
      "title": "to address",
      "oneOf": [
        {
          "title": "Contract Creation (null)",
          "type": "null"
        },
        {
          "title": "Address",
          "type": "string",
          "pattern": "^0x[0-9a-fA-F]{40}$"
        }
      ]
    },
    "gas": {
      "title": "gas limit",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "value": {
      "title": "value",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
    },
    "input": {
      "title": "input data",
      "type": "string",
      "pattern": "^0x[0-9a-f]*$"
    },
    "gasPrice": {
      "title": "gas price",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
      "description": "The gas price willing to be paid by the sender in wei"
    },
    "chainId": {
      "title": "chainId",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
      "description": "Chain ID that this transaction is valid on."
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| type | `string` | yes |  |
| nonce | `string` | yes |  |
| to | `oneOf` | no |  |
| gas | `string` | yes |  |
| value | `string` | yes |  |
| input | `string` | yes |  |
| gasPrice | `string` | yes | The gas price willing to be paid by the sender in wei |
| chainId | `string` | no | Chain ID that this transaction is valid on. |

