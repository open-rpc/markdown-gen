---
title: "addresses"
description: "Schema definition for addresses."
sidebar_label: "addresses"
schema_name: "addresses"
tags:
  - json-rpc
  - openrpc
  - schema
---

# addresses

---

## JSON Schema

```json
{
  "title": "hex encoded address",
  "type": "array",
  "items": {
    "title": "hex encoded address",
    "type": "string",
    "pattern": "^0x[0-9a-fA-F]{40}$"
  }
}
```

