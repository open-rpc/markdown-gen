---
title: "Transaction1559Unsigned"
description: "Schema definition for Transaction1559Unsigned."
sidebar_label: "Transaction1559Unsigned"
schema_name: "Transaction1559Unsigned"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Transaction1559Unsigned

---

## JSON Schema

```json
{
  "type": "object",
  "title": "EIP-1559 transaction.",
  "required": [
    "type",
    "nonce",
    "gas",
    "value",
    "input",
    "maxFeePerGas",
    "maxPriorityFeePerGas",
    "gasPrice",
    "chainId",
    "accessList"
  ],
  "properties": {
    "type": {
      "title": "type",
      "type": "string",
      "pattern": "^0x2$"
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
    "maxPriorityFeePerGas": {
      "title": "max priority fee per gas",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
      "description": "Maximum fee per gas the sender is willing to pay to miners in wei"
    },
    "maxFeePerGas": {
      "title": "max fee per gas",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
      "description": "The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei"
    },
    "gasPrice": {
      "title": "gas price",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
      "description": "The effective gas price paid by the sender in wei. For transactions not yet included in a block, this value should be set equal to the max fee per gas. This field is DEPRECATED, please transition to using effectiveGasPrice in the receipt object going forward."
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
| maxPriorityFeePerGas | `string` | yes | Maximum fee per gas the sender is willing to pay to miners in wei |
| maxFeePerGas | `string` | yes | The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei |
| gasPrice | `string` | yes | The effective gas price paid by the sender in wei. For transactions not yet included in a block, this value should be set equal to the max fee per gas. This field is DEPRECATED, please transition to using effectiveGasPrice in the receipt object going forward. |
| accessList | `object[]` | yes | EIP-2930 access list |
| chainId | `string` | yes | Chain ID that this transaction is valid on. |

