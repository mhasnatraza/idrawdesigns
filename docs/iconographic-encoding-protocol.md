# W2 Iconographic Encoding Protocol (Mixel System)

Goal: represent creative observations in compact visual-symbol form so notes can be stored as tiny units and expanded from micro to macro.

## 1) Core unit
- Name: `mixel`
- Definition: smallest symbolic data unit for one creative signal.
- Form: `[domain][style][intent][motion][rights]`

Example mixel token:
`[GD][MIN][CV][ST][AL]`

## 2) Symbol dictionaries

### Domain (`domain`)
- `AR` art
- `GD` graphic design
- `PH` photography
- `IL` illustration
- `FA` fashion
- `IN` interior
- `SC` sculpture
- `PF` performance
- `DY` DIY/handicraft
- `MK` marketing

### Style (`style`)
- `MIN` minimalist
- `MAX` maximalist
- `BRU` brutalist
- `RET` retro
- `LUX` luxury
- `ORG` organic
- `GEO` geometric
- `EXP` experimental

### Intent (`intent`)
- `AW` awareness
- `CO` consideration
- `CV` conversion
- `RT` retention

### Motion (`motion`)
- `ST` static
- `MO` motion
- `HY` hybrid

### Rights (`rights`)
- `AL` allowed
- `RS` restricted
- `UN` unknown

## 3) Scaling model (micro -> macro -> macro^2)
1. **Micro**: one mixel = one observation.
2. **Macro**: cluster 10–20 mixels by campaign/discipline.
3. **Macro^2**: aggregate macros into trend systems across weeks.

## 4) Storage format
Recommended compact record:
- `id`
- `utc`
- `mixel`
- `source_ref`
- `score` (1–5)
- `note` (optional, can be non-English)

## 5) Output behavior for W2
- Default to symbolic output first.
- Add optional plain-language expansion only when requested.
- Keep rights code mandatory in every token.
