---
title: "ExecutionPayloadV4"
description: "Schema definition for ExecutionPayloadV4."
sidebar_label: "ExecutionPayloadV4"
schema_name: "ExecutionPayloadV4"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ExecutionPayloadV4

---

## JSON Schema

```json
{
  "title": "Execution payload object V4",
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
    "excessBlobGas",
    "depositRequests",
    "withdrawalRequests",
    "consolidationRequests"
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
    },
    "depositRequests": {
      "title": "Deposit requests",
      "type": "array",
      "items": {
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
    },
    "withdrawalRequests": {
      "title": "Withdrawals requests",
      "type": "array",
      "items": {
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
    },
    "consolidationRequests": {
      "title": "Consolidation requests",
      "type": "array",
      "items": {
        "title": "Consolidation request object V1",
        "type": "object",
        "required": [
          "sourceAddress",
          "sourcePubkey",
          "targetPubkey"
        ],
        "properties": {
          "sourceAddress": {
            "title": "Source address",
            "type": "string",
            "pattern": "^0x[0-9a-fA-F]{40}$"
          },
          "sourcePubkey": {
            "title": "Source validator public key",
            "type": "string",
            "pattern": "^0x[0-9a-f]{96}$"
          },
          "targetPubkey": {
            "title": "Target validator public key",
            "type": "string",
            "pattern": "^0x[0-9a-f]{96}$"
          }
        }
      }
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
| depositRequests | `object[]` | yes |  |
| withdrawalRequests | `object[]` | yes |  |
| consolidationRequests | `object[]` | yes |  |

