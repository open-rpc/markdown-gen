---
title: "FilterTopic"
description: "Schema definition for FilterTopic."
sidebar_label: "FilterTopic"
schema_name: "FilterTopic"
tags:
  - json-rpc
  - openrpc
  - schema
---

# FilterTopic

---

## JSON Schema

```json
{
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
```

