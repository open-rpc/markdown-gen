---
title: "ExecutionPayloadV3"
description: "Schema definition for ExecutionPayloadV3."
sidebar_label: "ExecutionPayloadV3"
schema_name: "ExecutionPayloadV3"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ExecutionPayloadV3

---

## JSON Schema

```json
{
  "title": "Execution payload object V3",
  "type": "object",
  "required": [
    "parentHash",
    "feeRecipient",
    "stateRoot",
    "receiptsRoot",
    "logsBloom",
    "prevRandao",
    "blockNumber",
    "gasLimit",
    "gasUsed",
    "timestamp",
    "extraData",
    "baseFeePerGas",
    "blockHash",
    "transactions",
    "withdrawals",
    "blobGasUsed",
    "excessBlobGas"
  ],
  "properties": {
    "parentHash": {
      "title": "Parent block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "feeRecipient": {
      "title": "Recipient of transaction priority fees",
      "type": "string",
      "pattern": "^0x[0-9a-fA-F]{40}$"
    },
    "stateRoot": {
      "title": "State root",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "receiptsRoot": {
      "title": "Receipts root",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "logsBloom": {
      "title": "Bloom filter",
      "type": "string",
      "pattern": "^0x[0-9a-f]{512}$"
    },
    "prevRandao": {
      "title": "Previous randao value",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "blockNumber": {
      "title": "Block number",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "gasLimit": {
      "title": "Gas limit",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "gasUsed": {
      "title": "Gas used",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "timestamp": {
      "title": "Timestamp",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "extraData": {
      "title": "Extra data",
      "type": "string",
      "pattern": "^0x[0-9a-f]{0,64}$"
    },
    "baseFeePerGas": {
      "title": "Base fee per gas",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,31})|0$"
    },
    "blockHash": {
      "title": "Block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
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
      "type": "array",
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
    },
    "blobGasUsed": {
      "title": "Blob gas used",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    },
    "excessBlobGas": {
      "title": "Excess blob gas",
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
| parentHash | `string` | yes |  |
| feeRecipient | `string` | yes |  |
| stateRoot | `string` | yes |  |
| receiptsRoot | `string` | yes |  |
| logsBloom | `string` | yes |  |
| prevRandao | `string` | yes |  |
| blockNumber | `string` | yes |  |
| gasLimit | `string` | yes |  |
| gasUsed | `string` | yes |  |
| timestamp | `string` | yes |  |
| extraData | `string` | yes |  |
| baseFeePerGas | `string` | yes |  |
| blockHash | `string` | yes |  |
| transactions | `string[]` | yes |  |
| withdrawals | `object[]` | yes |  |
| blobGasUsed | `string` | yes |  |
| excessBlobGas | `string` | yes |  |

