---
title: "Transaction2930Signed"
description: "Schema definition for Transaction2930Signed."
sidebar_label: "Transaction2930Signed"
schema_name: "Transaction2930Signed"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Transaction2930Signed

---

## JSON Schema

```json
{
  "title": "Signed 2930 Transaction",
  "type": "object",
  "allOf": [
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
    },
    {
      "title": "EIP-2930 transaction signature properties.",
      "required": [
        "yParity",
        "r",
        "s"
      ],
      "properties": {
        "yParity": {
          "title": "yParity",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
          "description": "The parity (0 for even, 1 for odd) of the y-value of the secp256k1 signature."
        },
        "v": {
          "title": "v",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$",
          "description": "For backwards compatibility, `v` is optionally provided as an alternative to `yParity`. This field is DEPRECATED and all use of it should migrate to `yParity`."
        },
        "r": {
          "title": "r",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
        },
        "s": {
          "title": "s",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
        }
      }
    }
  ]
}
```

