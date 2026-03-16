import { CheckCircle2, Cpu, Globe, Languages, ShieldCheck, Sparkles, Video, Image as ImageIcon, FileText } from 'lucide-react';
import { stylePresets } from '../data/stylePresets';

const capabilityStack = [
  {
    icon: ImageIcon,
    title: 'Image + Image-to-Image + Reference',
    tools: 'FLUX.1-dev / SDXL + IP-Adapter / ControlNet + Segment Anything (SAM2)',
  },
  {
    icon: Video,
    title: 'Video Analysis + Generation',
    tools: 'LTX-Video or HunyuanVideo + CogVideoX + RIFE interpolation',
  },
  {
    icon: Globe,
    title: 'Web Research + Document Reader',
    tools: 'SearXNG + Playwright crawler + OCR (PaddleOCR/Tesseract) + RAG (Qdrant)',
  },
  {
    icon: FileText,
    title: 'Text Analysis + Multilingual Quality',
    tools: 'Llama 3.1 / Qwen2.5 + LanguageTool + NLLB translation + custom glossary',
  },
  {
    icon: Sparkles,
    title: 'Design Utilities',
    tools: 'Real-ESRGAN upscale + RMBG remove-bg + vtracer/Potrace SVG vectorization',
  },
  {
    icon: ShieldCheck,
    title: 'Subject Consistency',
    tools: 'LoRA + DreamBooth + face/ID adapters for image and keyframe video guidance',
  },
];

const rollout = [
  'Phase 1: Ship browser-first iPad interface (PWA) with image generation, image reference, presets, and document reader.',
  'Phase 2: Add analysis suite: web research agents, OCR, text analysis, and multilingual spelling/grammar enforcement.',
  'Phase 3: Add subject-consistent image-to-video/video generation pipeline and training workspace for custom LoRAs.',
  'Phase 4: Production hardening: queue workers, GPU autoscaling, user projects, audit logs, and billing controls.',
];

const StudioBlueprint = () => (
  <section className="space-y-4">
    <div className="rounded-xl border border-white/10 bg-[#0f172a] p-3">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <Cpu className="w-4 h-4 text-blue-300" />
        Build Plan for Your Self-Trained AI Studio
      </h3>
      <p className="text-xs text-slate-400 mt-2">
        This stack is optimized for iPad browser usage, open-source models, and modular growth from image workflows to
        full multimodal design automation.
      </p>
    </div>

    <div className="space-y-2">
      {capabilityStack.map(({ icon: Icon, title, tools }) => (
        <div key={title} className="rounded-xl border border-white/10 bg-[#0f172a] p-3">
          <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-purple-300" />
            {title}
          </p>
          <p className="text-xs text-slate-400 mt-1">{tools}</p>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-white/10 bg-[#0f172a] p-3">
      <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
        <Languages className="w-3.5 h-3.5 text-emerald-300" />
        Spelling + Grammar Quality Gate
      </p>
      <p className="text-xs text-slate-400 mt-1">
        Run every generated copy through LanguageTool + LLM rewrite checks before publish/export to ensure near-zero
        grammar and spelling errors in multiple languages.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-[#0f172a] p-3">
      <p className="text-xs font-semibold text-slate-100 mb-2">100 Style Presets (ready catalog)</p>
      <div className="max-h-28 overflow-y-auto pr-1 flex flex-wrap gap-1.5">
        {stylePresets.map((preset) => (
          <span key={preset} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {preset}
          </span>
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-white/10 bg-[#0f172a] p-3">
      <p className="text-xs font-semibold text-slate-100 mb-2">Execution Roadmap</p>
      <ul className="space-y-1.5">
        {rollout.map((step) => (
          <li key={step} className="text-xs text-slate-300 flex gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-300 shrink-0" />
            {step}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default StudioBlueprint;
