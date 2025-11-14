---
title: "Transaction2930Unsigned"
description: "Schema definition for Transaction2930Unsigned."
sidebar_label: "Transaction2930Unsigned"
schema_name: "Transaction2930Unsigned"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Transaction2930Unsigned

---

## JSON Schema

```json
{
  "type": "object",
  "title": "EIP-2930 transaction.",
  "required": [
    "type",
    "nonce",
    "gas",
    "value",
    "input",
    "gasPrice",
    "chainId",
    "accessList"
  ],
  "properties": {
    "type": {
      "title": "type",
      "type": "string",
      "pattern": "^0x1$"
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
    "accessList": {
      "title": "accessList",
      "type": "array",
      "items": {
        "title": "Access list entry",
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "address": {
            "title": "hex encoded address",
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]{40}$"
          },
          "storageKeys": {
            "type": "array",
            "items": {
              "title": "32 byte hex value",
              "type": "string",
              "pattern": "^0x[0-9a-f]{64}$"
            }
          }
        }
      },
      "description": "EIP-2930 access list"
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
| accessList | `object[]` | yes | EIP-2930 access list |
| chainId | `string` | yes | Chain ID that this transaction is valid on. |

