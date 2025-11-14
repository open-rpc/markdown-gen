---
title: "TransitionConfigurationV1"
description: "Schema definition for TransitionConfigurationV1."
sidebar_label: "TransitionConfigurationV1"
schema_name: "TransitionConfigurationV1"
tags:
  - json-rpc
  - openrpc
  - schema
---

# TransitionConfigurationV1

---

## JSON Schema

```json
{
  "title": "Transition configuration object",
  "type": "object",
  "required": [
    "terminalTotalDifficulty",
    "terminalBlockHash",
    "terminalBlockNumber"
  ],
  "properties": {
    "terminalTotalDifficulty": {
      "title": "Terminal total difficulty",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,31})|0$"
    },
    "terminalBlockHash": {
      "title": "Terminal block hash",
      "type": "string",
      "pattern": "^0x[0-9a-f]{64}$"
    },
    "terminalBlockNumber": {
      "title": "Terminal block number",
      "type": "string",
      "pattern": "^0x([1-9a-f]+[0-9a-f]{0,15})|0$"
    }
  }
}
```

---

## Properties

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| terminalTotalDifficulty | `string` | yes |  |
| terminalBlockHash | `string` | yes |  |
| terminalBlockNumber | `string` | yes |  |

