---
title: "FilterTopics"
description: "Schema definition for FilterTopics."
sidebar_label: "FilterTopics"
schema_name: "FilterTopics"
tags:
  - json-rpc
  - openrpc
  - schema
---

# FilterTopics

---

## JSON Schema

```json
{
  "title": "Filter Topics",
  "oneOf": [
    {
      "title": "Any Topic Match",
      "type": "null"
    },
    {
      "title": "Specified Filter Topics",
      "type": "array",
      "items": {
        "title": "Filter Topic List Entry",
        "oneOf": [
          {
            "title": "Single Topic Match",
            "type": "string",
            "pattern": "^0x[0-9a-f]{64}$"
          },
          {
            "title": "Multiple Topic Match",
            "type": "array",
            "items": {
              "title": "32 hex encoded bytes",
              "type": "string",
              "pattern": "^0x[0-9a-f]{64}$"
            }
          }
        ]
      }
    }
  ]
}
```

