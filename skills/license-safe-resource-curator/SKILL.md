---
name: license-safe-resource-curator
description: Curate creative references and stock assets with explicit commercial-usage checks, source licensing notes, and restriction flags. Use when collecting images/videos/campaign examples for design or marketing workflows where legal safety and reuse rights must be tracked.
---

# License-Safe Resource Curator

## Workflow
1. Collect candidate references from approved sources.
2. Record source URL, capture date, and intended use.
3. Classify rights status as `yes`, `no`, or `conditional` for commercial use.
4. Add attribution requirement and restriction notes.
5. Reject entries with unclear or missing licensing context.

## Required output format
For every reference, return:
- Title
- URL
- Source platform
- Commercial use allowed (yes/no/conditional)
- Attribution required (yes/no)
- Restriction notes
- Suggested safe use (inspiration-only, direct-use, or licensed-use)

## Guardrails
- Prefer official source license pages over third-party summaries.
- Treat entertainment IP (e.g., studios/streaming brands) as inspiration-only unless explicit written license exists.
- Do not mark commercial use as `yes` when terms are ambiguous.
