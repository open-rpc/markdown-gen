---
title: "NewPet"
description: "Schema definition for NewPet."
sidebar_label: "NewPet"
schema_name: "NewPet"
tags:
  - json-rpc
  - openrpc
  - schema
---

# NewPet

---

## JSON Schema

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "tag": {
      "type": "string"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| name | `string` | yes |  |
| tag | `string` | no |  |

