# i Draw Design

A browser-first AI design workspace built with React + Vite, currently focused on prompt-driven image generation and canvas workflows.

## Product Direction: Self-Trained Multimodal Studio

This project now includes an in-app **Build Plan** panel that maps your requested capabilities into an open-source stack:

- Image generation + image-to-image + reference guidance
- Web research, document reading, image/video/text analysis
- Video generation with subject consistency
- 100 style presets
- Upscaling, background removal, SVG vector conversion
- Multilingual text quality controls (near-zero spelling/grammar errors)

## Suggested Open-Source Stack

- **Core orchestrator:** FastAPI + Celery + Redis queue
- **Image models:** FLUX.1-dev, SDXL, ControlNet, IP-Adapter
- **Video models:** LTX-Video, HunyuanVideo, CogVideoX
- **Research + RAG:** SearXNG, Playwright crawler, Qdrant
- **Text quality:** Llama/Qwen + LanguageTool + NLLB
- **Image utilities:** Real-ESRGAN, RMBG, vtracer/Potrace
- **Consistency training:** LoRA / DreamBooth adapters

## iPad Browser Delivery

- Ship as **PWA** first for touch support and Home Screen install.
- Keep generation backend remote GPU based; iPad only runs UI and uploads assets.
- Use chunked upload + resumable jobs for larger video tasks.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
