---
title: "uint64"
description: "Schema definition for uint64."
sidebar_label: "uint64"
schema_name: "uint64"
tags:
  - json-rpc
  - openrpc
  - schema
---

# uint64

---

## JSON Schema

```json
{
  "title": "hex encoded 64 bit unsigned integer",
  "type": "string",
  "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
}
```

