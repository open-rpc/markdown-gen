---
title: "BlobsBundleV1"
description: "Schema definition for BlobsBundleV1."
sidebar_label: "BlobsBundleV1"
schema_name: "BlobsBundleV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# BlobsBundleV1

---

## JSON Schema

```json
{
  "title": "Blobs bundle object V1",
  "type": "object",
  "required": [
    "commitments",
    "proofs",
    "blobs"
  ],
  "properties": {
    "commitments": {
      "title": "Commitments",
      "type": "array",
      "items": {
        "title": "48 hex encoded bytes",
        "type": "string",
        "pattern": "^0x[0-9a-f]{96}$"
      }
    },
    "proofs": {
      "title": "Proofs",
      "type": "array",
      "items": {
        "title": "48 hex encoded bytes",
        "type": "string",
        "pattern": "^0x[0-9a-f]{96}$"
      }
    },
    "blobs": {
      "title": "Blobs",
      "type": "array",
      "items": {
        "title": "hex encoded bytes",
        "type": "string",
        "pattern": "^0x[0-9a-f]*$"
      }
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| commitments | `string[]` | yes |  |
| proofs | `string[]` | yes |  |
| blobs | `string[]` | yes |  |

