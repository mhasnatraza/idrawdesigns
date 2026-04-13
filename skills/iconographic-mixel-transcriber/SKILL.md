---
name: iconographic-mixel-transcriber
description: Transcribe creative references into compact iconographic mixel tokens for micro-to-macro analysis. Use when the user wants symbolic, language-light storage instead of full English notes while preserving rights and intent metadata.
---

# Iconographic Mixel Transcriber

## Workflow
1. Read reference and identify domain, style, intent, motion, rights.
2. Emit one or more mixel tokens in compact bracket format.
3. Group tokens into micro, macro, and macro^2 sets.
4. Preserve source reference and UTC timestamp.
5. Provide optional text expansion only when explicitly requested.

## Token format
`[domain][style][intent][motion][rights]`

## Required output
- `utc`
- `source_ref`
- `mixel`
- `cluster` (`micro` | `macro` | `macro2`)
- `score`

## Guardrails
- Rights code is mandatory on every token.
- If rights are unclear, use `UN` and flag as non-reusable.
- Do not fabricate licenses or ownership claims.
