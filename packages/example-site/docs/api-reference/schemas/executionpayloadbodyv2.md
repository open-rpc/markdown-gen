---
title: "ExecutionPayloadBodyV2"
description: "Schema definition for ExecutionPayloadBodyV2."
sidebar_label: "ExecutionPayloadBodyV2"
schema_name: "ExecutionPayloadBodyV2"
tags:
  - json-rpc
  - openrpc
  - schema
---

# ExecutionPayloadBodyV2

---

## JSON Schema

```json
{
  "title": "Execution payload body object V2",
  "type": "object",
  "required": [
    "transactions"
  ],
  "properties": {
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
      "type": [
        "array",
        "null"
      ],
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
    "depositRequests": {
      "title": "Deposit requests",
      "type": [
        "array",
        "null"
      ],
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
      "type": [
        "array",
        "null"
      ],
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
      "title": "Consolidation requests - array - 'null'",
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
| transactions | `string[]` | yes |  |
| withdrawals | `array,null` | no |  |
| depositRequests | `array,null` | no |  |
| withdrawalRequests | `array,null` | no |  |
| consolidationRequests | `any` | no |  |

