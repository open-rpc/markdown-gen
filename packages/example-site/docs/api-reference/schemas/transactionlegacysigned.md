---
title: "TransactionLegacySigned"
description: "Schema definition for TransactionLegacySigned."
sidebar_label: "TransactionLegacySigned"
schema_name: "TransactionLegacySigned"
tags:
  - json-rpc
  - openrpc
  - schema
---

# TransactionLegacySigned

---

## JSON Schema

```json
{
  "title": "Signed Legacy Transaction",
  "type": "object",
  "allOf": [
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
    },
    {
      "title": "Legacy transaction signature properties.",
      "required": [
        "v",
        "r",
        "s"
      ],
      "properties": {
        "v": {
          "title": "v",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
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

