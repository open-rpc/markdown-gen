---
title: "TransactionSigned"
description: "Schema definition for TransactionSigned."
sidebar_label: "TransactionSigned"
schema_name: "TransactionSigned"
tags:
  - json-rpc
  - openrpc
  - schema
---

# TransactionSigned

---

## JSON Schema

```json
{
  "oneOf": [
    {
      "title": "Signed 4844 Transaction",
      "type": "object",
      "allOf": [
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
        },
        {
          "title": "EIP-4844 transaction signature properties.",
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
    },
    {
      "title": "Signed 1559 Transaction",
      "type": "object",
      "allOf": [
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
        },
        {
          "title": "EIP-1559 transaction signature properties.",
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
    },
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
    },
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
  ]
}
```

