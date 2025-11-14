---
title: "Pet"
description: "Schema definition for Pet."
sidebar_label: "Pet"
schema_name: "Pet"
tags:
  - json-rpc
  - openrpc
  - schema
---

# Pet

---

## JSON Schema

```json
{
  "allOf": [
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
    },
    {
      "required": [
        "id"
      ],
      "properties": {
        "id": {
          "type": "integer"
        }
      }
    }
  ]
}
```

