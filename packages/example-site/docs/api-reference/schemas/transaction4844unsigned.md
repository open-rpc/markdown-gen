---
title: "Transaction4844Unsigned"
description: "Schema definition for Transaction4844Unsigned."
sidebar_label: "Transaction4844Unsigned"
schema_name: "Transaction4844Unsigned"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Transaction4844Unsigned

---

## JSON Schema

```json
{
  "type": "object",
  "title": "EIP-4844 transaction.",
  "required": [
    "type",
    "nonce",
    "to",
    "gas",
    "value",
    "input",
    "maxPriorityFeePerGas",
    "maxFeePerGas",
    "maxFeePerBlobGas",
    "accessList",
    "blobVersionedHashes",
    "chainId"
  ],
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
| to | `string` | yes |  |
| gas | `string` | yes |  |
| value | `string` | yes |  |
| input | `string` | yes |  |
| maxPriorityFeePerGas | `string` | yes | Maximum fee per gas the sender is willing to pay to miners in wei |
| maxFeePerGas | `string` | yes | The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei |
| maxFeePerBlobGas | `string` | yes | The maximum total fee per gas the sender is willing to pay for blob gas in wei |
| accessList | `object[]` | yes | EIP-2930 access list |
| blobVersionedHashes | `string[]` | yes | List of versioned blob hashes associated with the transaction's EIP-4844 data blobs. |
| chainId | `string` | yes | Chain ID that this transaction is valid on. |

