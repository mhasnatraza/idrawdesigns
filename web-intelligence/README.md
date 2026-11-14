# Web Intelligence — Google AI Edge Gallery

A JavaScript Agent Skill for live web search, webpage extraction, multi-source research and source verification.

## Compatibility
Built to the documented Gallery JavaScript skill contract: `SKILL.md`, `scripts/index.html`, and `window.ai_edge_gallery_get_result(data)`. iPad/iOS compatibility is **pending device verification**. Android source documentation is not proof of iOS parity.

## Network providers
- Search: Jina Search at `https://s.jina.ai/`
- Page extraction: Jina Reader at `https://r.jina.ai/`
- Limited fallback: DuckDuckGo Instant Answer API

No API key is required. Internet access is required. Search queries and page URLs are sent to these third-party services.

## Test
In Agent Mode ask: "Use Web Intelligence to diagnose its network connection."
Then ask it to search for a current topic, open official sources and cite their URLs.

## Limitations
Not a full browser. No authenticated sessions, no guaranteed access to all sites, no paywall bypass, and no offline web retrieval. Some endpoints or sites may be blocked by CORS, network policy, rate limits or anti-bot controls.