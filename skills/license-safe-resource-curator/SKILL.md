---
name: license-safe-resource-curator
description: Curate creative references and stock assets with explicit commercial-usage checks, source licensing notes, and restriction flags. Use when collecting images/videos/campaign examples for design or marketing workflows where legal safety, attribution, and evidence logs are required.
---

# License-Safe Resource Curator

## Workflow
1. Collect candidate references from approved sources.
2. Record URL, capture date/time (UTC), intended use, and platform terms link.
3. Classify rights status as `allowed`, `restricted`, or `unknown`.
4. Add attribution requirement and derivative-use restrictions.
5. Reject or quarantine entries with unclear licensing context.

## Required output format
For every reference, return:
- Title
- URL
- Source platform
- Capture timestamp (UTC)
- Commercial use status
- Attribution required (yes/no)
- Restriction notes
- Suggested safe use (`inspiration-only`, `licensed-use`, `blocked`)

## Guardrails
- Prefer official source license pages over third-party summaries.
- Treat entertainment IP (e.g., studios/streaming brands) as inspiration-only unless explicit written license exists.
- Do not mark commercial use as `allowed` when terms are ambiguous.
