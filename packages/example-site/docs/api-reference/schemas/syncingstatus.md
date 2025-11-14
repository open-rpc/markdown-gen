---
title: "SyncingStatus"
description: "Schema definition for SyncingStatus."
sidebar_label: "SyncingStatus"
schema_name: "SyncingStatus"
tags:
  - json-rpc
  - openrpc
  - schema
---

# SyncingStatus

---

## JSON Schema

```json
{
  "title": "Syncing status",
  "oneOf": [
    {
      "title": "Syncing progress",
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "startingBlock": {
          "title": "Starting block",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
        },
        "currentBlock": {
          "title": "Current block",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
        },
        "highestBlock": {
          "title": "Highest block",
          "type": "string",
          "pattern": "^0x([1-9a-f]+[0-9a-f]*|0)$"
        }
      }
    },
    {
      "title": "Not syncing",
      "description": "Should always return false if not syncing.",
      "type": "boolean"
    }
  ]
}
```

