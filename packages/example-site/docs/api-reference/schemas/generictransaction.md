---
title: "GenericTransaction"
description: "Schema definition for GenericTransaction."
sidebar_label: "GenericTransaction"
schema_name: "GenericTransaction"
tags:
  - json-rpc
  - openrpc
  - schema
---

# GenericTransaction

---

## JSON Schema

```json
{
  "type": "object",
  "title": "Transaction object generic to all types",
  "additionalProperties": false,
  "properties": {
    "type": {
      "title": "type",
      "type": "string",
      "pattern": "^0x([0-9a-fA-F]?){1,2}$"
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
    "from": {
      "title": "from address",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
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
    "maxFeePerBlobGas": {
      "title": "max fee per blob gas",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
      "description": "The maximum total fee per gas the sender is willing to pay for blob gas in wei"
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
    "blobVersionedHashes": {
      "title": "blobVersionedHashes",
      "description": "List of versioned blob hashes associated with the transaction's EIP-4844 data blobs.",
      "type": "array",
      "items": {
        "title": "32 byte hex value",
        "type": "string",
        "pattern": "^0x[0-9a-f]{64}$"
      }
    },
    "blobs": {
      "title": "blobs",
      "description": "Raw blob data.",
      "type": "array",
      "items": {
        "title": "hex encoded bytes",
        "type": "string",
        "pattern": "^0x[0-9a-f]*$"
      }
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
| type | `string` | no |  |
| nonce | `string` | no |  |
| to | `oneOf` | no |  |
| from | `string` | no |  |
| gas | `string` | no |  |
| value | `string` | no |  |
| input | `string` | no |  |
| gasPrice | `string` | no | The gas price willing to be paid by the sender in wei |
| maxPriorityFeePerGas | `string` | no | Maximum fee per gas the sender is willing to pay to miners in wei |
| maxFeePerGas | `string` | no | The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei |
| maxFeePerBlobGas | `string` | no | The maximum total fee per gas the sender is willing to pay for blob gas in wei |
| accessList | `object[]` | no | EIP-2930 access list |
| blobVersionedHashes | `string[]` | no | List of versioned blob hashes associated with the transaction's EIP-4844 data blobs. |
| blobs | `string[]` | no | Raw blob data. |
| chainId | `string` | no | Chain ID that this transaction is valid on. |

