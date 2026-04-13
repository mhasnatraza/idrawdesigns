# Creative LLM Skill Bank (Graphic Design + Marketing)

## 1) Is this doable?
Yes. It is doable, and this is a strong approach if we build in phases:
1. Define legal-safe source rules.
2. Build a skill bank with repeatable workflows.
3. Add a small knowledge base that stores licensed references and reusable insights.
4. Run a daily operating cadence.

## 2) First-pass setup architecture

### A. Core system layers
- **Skill Layer**: task-specific skills (brief writing, moodboard curation, ad concept generation, content calendars).
- **Knowledge Base Layer**: indexed notes, source links, license metadata, trend observations, and reusable prompts.
- **Governance Layer**: rights checks, source trust levels, citation rules, and “do-not-use” constraints.
- **Execution Layer**: daily/weekly routines to continuously collect, normalize, and rate references.

### B. Minimum data schema for each collected reference
Use this structure for every entry:
- `title`
- `source_platform`
- `url`
- `capture_date`
- `content_type` (image/video/campaign/article)
- `industry`
- `style_tags` (e.g., brutalist, minimalist, kinetic type)
- `marketing_tags` (awareness, conversion, retention)
- `license_summary`
- `commercial_use_allowed` (yes/no/conditional)
- `attribution_required` (yes/no)
- `notes_on_restrictions`
- `derived_insights`

### C. Legal-safe sourcing policy (working baseline)
- **Allowed for commercial inspiration/assets with conditions**: Unsplash, Pexels, Shutterstock (per their license models).
- **Inspiration-only (not direct reuse unless explicit rights)**: Pinterest, Behance, DeviantArt, Netflix, DreamWorks brand/media properties.
- **Always preserve source link + timestamp + rights note** in the knowledge base.
- **Never train a private model on copyrighted media without explicit permission/license**.

## 3) Initial source-confidence matrix

| Source | Use in workflow | Commercial reuse baseline |
|---|---|---|
| Unsplash | stock photo sourcing + inspiration | generally allowed under Unsplash License; check restrictions |
| Pexels | stock photo/video sourcing | generally allowed under Pexels License; check restrictions |
| Shutterstock | paid stock sourcing | allowed via purchased license scope |
| Pinterest | trend discovery, moodboard leads | inspiration/discovery only by default |
| Behance | portfolio/campaign benchmarking | inspiration/analysis only by default |
| DeviantArt | style exploration | inspiration only unless explicit license from creator |
| Netflix | storytelling references, trailer analysis | inspiration only; IP protected |
| DreamWorks | visual storytelling references | inspiration only; IP protected |

## 4) Skill bank v1 (created in this repo)
- `license-safe-resource-curator`: enforce rights checks and source metadata completeness.
- `creative-brief-builder`: turn goals into structured campaign briefs.
- `trend-board-curator`: collect and normalize trend references into actionable design/marketing angles.

## 5) Daily execution plan (slow, sustainable build)

### Week 1 (foundation)
- Day 1: finalize data schema + legal labels.
- Day 2: create source whitelist/graylist/blacklist.
- Day 3: collect 20 references from legal-safe sources.
- Day 4: tag references and extract 1 insight each.
- Day 5: build 3 reusable prompt templates.
- Day 6: run first mini retrospective (what was noisy/useful).
- Day 7: cleanup and deduplicate.

### Ongoing daily routine (60–90 min)
1. **Collect (20 min)**: 5–10 high-signal references.
2. **Classify (15 min)**: tag style + funnel stage + audience.
3. **Rights check (10 min)**: assign commercial status.
4. **Synthesize (15 min)**: write “what this means for campaigns.”
5. **Produce (15–30 min)**: generate 1 design concept + 1 marketing angle.

## 6) Alignment checkpoint before scaling
Before we scale automation, align on:
- industries to prioritize (fashion, SaaS, D2C, etc.)
- visual style priorities
- paid vs free source mix
- brand risk tolerance (strict vs flexible licensing posture)

If aligned, next step is to implement ingestion templates and start controlled daily collection.
