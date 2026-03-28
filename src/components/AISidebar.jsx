import {
    Sparkles,
    Wand2,
    Image as ImageIcon,
    Zap,
    History,
    Video,
    Music,
    ScanSearch,
    Upload,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Brain, IDD } from '../services/brain';

const TABS = [
    { id: 'text-image', label: 'Text → Image', icon: ImageIcon },
    { id: 'text-video', label: 'Text → Video', icon: Video },
    { id: 'image-video', label: 'Image → Video', icon: Upload },
    { id: 'audio', label: 'Text → Audio', icon: Music },
    { id: 'reader', label: 'Image Reader', icon: ScanSearch }
];

const IMAGE_MODELS = ['seeddream', 'lucide'];

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const preloadImage = (src) => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
});

const buildImageUrl = (prompt, model = 'seeddream') => {
    const encoded = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=${model}&nologo=true`;
};

const createPanVideoFromImage = async (imageUrl, label = 'preview') => {
    const image = await preloadImage(imageUrl);
    if (!image) throw new Error('Could not load image for video rendering');

    const width = 768;
    const height = 768;
    const durationMs = 5000;
    const fps = 30;
    const frameCount = Math.floor(durationMs / (1000 / fps));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks = [];

    recorder.ondataavailable = (event) => {
        if (event.data?.size) chunks.push(event.data);
    };

    recorder.start();

    for (let i = 0; i < frameCount; i += 1) {
        const progress = i / frameCount;
        const scale = 1.05 + progress * 0.15;
        const drawW = width * scale;
        const drawH = height * scale;
        const x = -(drawW - width) * progress;
        const y = -(drawH - height) * (1 - progress * 0.5);

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, x, y, drawW, drawH);

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, height - 60, width, 60);
        ctx.fillStyle = 'white';
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(label.slice(0, 70), 20, height - 24);

        await new Promise((r) => setTimeout(r, 1000 / fps));
    }

    recorder.stop();
    await new Promise((resolve) => {
        recorder.onstop = resolve;
    });

    const blob = new Blob(chunks, { type: 'video/webm' });
    return URL.createObjectURL(blob);
};

const generateAudioFromPrompt = async (prompt) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const destination = audioCtx.createMediaStreamDestination();

    const seed = prompt
        .split('')
        .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const baseFreq = 120 + (seed % 240);

    const oscA = audioCtx.createOscillator();
    const oscB = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscA.type = 'sine';
    oscB.type = 'triangle';
    oscA.frequency.value = baseFreq;
    oscB.frequency.value = baseFreq * 1.5;

    gain.gain.value = 0.0001;
    gain.gain.exponentialRampToValueAtTime(0.24, audioCtx.currentTime + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 6);

    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(destination);
    gain.connect(audioCtx.destination);

    const recorder = new MediaRecorder(destination.stream, { mimeType: 'audio/webm' });
    const chunks = [];
    recorder.ondataavailable = (event) => {
        if (event.data?.size) chunks.push(event.data);
    };

    recorder.start();
    oscA.start();
    oscB.start();

    await new Promise((r) => setTimeout(r, 6500));

    oscA.stop();
    oscB.stop();
    recorder.stop();

    await new Promise((resolve) => {
        recorder.onstop = resolve;
    });

    await audioCtx.close();

    const blob = new Blob(chunks, { type: 'audio/webm' });
    return URL.createObjectURL(blob);
};

const analyzeImage = (file, img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, img.width, img.height);

    let r = 0;
    let g = 0;
    let b = 0;
    const pixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
    }

    const avgR = Math.round(r / pixels);
    const avgG = Math.round(g / pixels);
    const avgB = Math.round(b / pixels);

    const brightness = Math.round((avgR + avgG + avgB) / 3);
    const tone = brightness > 170 ? 'Bright' : brightness > 90 ? 'Balanced' : 'Dark';

    return {
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        width: img.width,
        height: img.height,
        dominantColor: `rgb(${avgR}, ${avgG}, ${avgB})`,
        tone,
        suggestion: tone === 'Dark'
            ? 'Try adding exposure + warm highlights before generating variations.'
            : 'Image is generation-ready. You can use it for consistent style transfer videos.'
    };
};

const AISidebar = () => {
    const [tab, setTab] = useState('text-image');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [generatedImages, setGeneratedImages] = useState([]);
    const [generatedVideos, setGeneratedVideos] = useState([]);
    const [generatedAudios, setGeneratedAudios] = useState([]);

    const [uploadedImage, setUploadedImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [selectedModel, setSelectedModel] = useState('seeddream');

    const canGenerate = useMemo(() => prompt.trim().length > 0, [prompt]);

    const learnPrompt = (rating) => {
        if (!prompt.trim()) return;
        Brain.learn(prompt, rating);
    };

    const handleGenerateImage = async () => {
        if (!canGenerate) return;
        setIsGenerating(true);

        try {
            const enhancedPrompt = IDD.direct(prompt, { mode: 'image', model: selectedModel });
            Brain.train(enhancedPrompt);

            const url = buildImageUrl(enhancedPrompt, selectedModel);
            await preloadImage(url);

            setGeneratedImages((prev) => [{ url, prompt: enhancedPrompt }, ...prev]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateTextVideo = async () => {
        if (!canGenerate) return;
        setIsGenerating(true);

        try {
            const cinematicPrompt = IDD.direct(prompt, { mode: 'video', model: selectedModel });
            Brain.train(cinematicPrompt);

            const frameUrl = buildImageUrl(cinematicPrompt, selectedModel);
            const videoUrl = await createPanVideoFromImage(frameUrl, prompt);
            setGeneratedVideos((prev) => [{ url: videoUrl, prompt: cinematicPrompt, source: frameUrl }, ...prev]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateImageVideo = async () => {
        if (!uploadedImage) return;
        setIsGenerating(true);

        try {
            const videoUrl = await createPanVideoFromImage(uploadedImage.url, uploadedImage.name);
            setGeneratedVideos((prev) => [{ url: videoUrl, prompt: `Animation from ${uploadedImage.name}`, source: uploadedImage.url }, ...prev]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateAudio = async () => {
        if (!canGenerate) return;
        setIsGenerating(true);

        try {
            const enhancedPrompt = IDD.direct(prompt, { mode: 'video', model: 'idd' });
            Brain.train(enhancedPrompt);
            const audioUrl = await generateAudioFromPrompt(enhancedPrompt);
            setGeneratedAudios((prev) => [{ url: audioUrl, prompt: enhancedPrompt }, ...prev]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const url = await readFileAsDataUrl(file);
        const img = await preloadImage(url);
        if (!img) return;

        setUploadedImage({ url, name: file.name });
        setAnalysis(analyzeImage(file, img));
    };

    const runActiveMode = () => {
        if (tab === 'text-image') return handleGenerateImage();
        if (tab === 'text-video') return handleGenerateTextVideo();
        if (tab === 'image-video') return handleGenerateImageVideo();
        if (tab === 'audio') return handleGenerateAudio();
        return Promise.resolve();
    };

    return (
        <div className="w-[360px] bg-[#1e293b] border-l border-white/5 flex flex-col h-full glass-panel">
            <div className="p-4 border-b border-white/5 space-y-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    IDD Intelligence Lab
                </h2>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    Free generation stack: Pollinations + local browser media pipeline. The IDD brain continuously trains on your choices.
                </p>
            </div>

            <div className="p-4 border-b border-white/5">
                <div className="grid grid-cols-2 gap-2">
                    {TABS.map((item) => {
                        const Icon = item.icon;
                        const active = tab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`px-2 py-2 rounded-lg text-[11px] flex items-center gap-1.5 justify-center border transition-colors ${active
                                    ? 'bg-purple-500/20 border-purple-400/50 text-purple-200'
                                    : 'bg-[#0f172a] border-white/10 text-slate-300 hover:border-white/20'}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {tab !== 'reader' && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Prompt</label>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors h-28 resize-none"
                                placeholder="Describe your idea..."
                            />
                            <button
                                className="absolute bottom-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                                title="Enhance with AI"
                                onClick={() => setPrompt(`Ultra realistic, cinematic lighting, ${prompt}`)}
                            >
                                <Wand2 className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => learnPrompt('up')}
                                className="p-2 rounded-lg bg-[#0f172a] border border-white/10 hover:border-emerald-400/50"
                                title="Train brain: good result"
                            >
                                <ThumbsUp className="w-3.5 h-3.5 text-emerald-300" />
                            </button>
                            <button
                                onClick={() => learnPrompt('down')}
                                className="p-2 rounded-lg bg-[#0f172a] border border-white/10 hover:border-rose-400/50"
                                title="Train brain: poor result"
                            >
                                <ThumbsDown className="w-3.5 h-3.5 text-rose-300" />
                            </button>
                            <span className="text-[11px] text-slate-500">Self-training memory is stored locally.</span>
                        </div>

                        {(tab === 'text-image' || tab === 'text-video') && (
                            <div className="space-y-1">
                                <label className="text-[11px] text-slate-400">Image model</label>
                                <select
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full h-9 bg-[#0f172a] border border-white/10 rounded-lg px-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                                >
                                    {IMAGE_MODELS.map((model) => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {(tab === 'image-video' || tab === 'reader') && (
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-slate-400">Upload image</label>
                        <label className="w-full h-24 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-slate-300 text-xs cursor-pointer bg-[#0f172a] hover:border-purple-400/40">
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <span className="flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Select file</span>
                        </label>
                        {uploadedImage && (
                            <img src={uploadedImage.url} alt="Uploaded" className="w-full h-36 rounded-xl object-cover border border-white/10" />
                        )}
                    </div>
                )}

                {tab !== 'reader' && (
                    <button
                        onClick={runActiveMode}
                        disabled={isGenerating || ((tab !== 'image-video') && !canGenerate) || (tab === 'image-video' && !uploadedImage)}
                        className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isGenerating ? 'Processing...' : 'Generate'}
                    </button>
                )}

                {tab === 'reader' && (
                    <div className="space-y-2 p-3 rounded-xl border border-white/10 bg-[#0f172a] text-xs">
                        <h3 className="text-slate-300 text-sm">Image Reader Report</h3>
                        {!analysis && <p className="text-slate-500">Upload an image to extract visual stats.</p>}
                        {analysis && (
                            <>
                                <p className="text-slate-300">File: <span className="text-slate-400">{analysis.name}</span></p>
                                <p className="text-slate-300">Size: <span className="text-slate-400">{analysis.sizeKb} KB</span></p>
                                <p className="text-slate-300">Resolution: <span className="text-slate-400">{analysis.width}×{analysis.height}</span></p>
                                <p className="text-slate-300">Dominant color: <span className="text-slate-400">{analysis.dominantColor}</span></p>
                                <p className="text-slate-300">Exposure tone: <span className="text-slate-400">{analysis.tone}</span></p>
                                <p className="text-emerald-300">Tip: {analysis.suggestion}</p>
                            </>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <h3 className="text-xs font-medium text-slate-400 flex items-center justify-between">
                        Generated Assets
                        <History className="w-3 h-3" />
                    </h3>

                    <div className="grid gap-3">
                        {generatedImages.map((img, idx) => (
                            <div key={`img-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#0f172a]">
                                <img src={img.url} className="w-full h-full object-cover" alt="Generated" />
                            </div>
                        ))}

                        {generatedVideos.map((video, idx) => (
                            <div key={`vid-${idx}`} className="rounded-xl overflow-hidden border border-white/10 bg-black/50 p-2">
                                <video src={video.url} controls className="w-full rounded-lg" />
                            </div>
                        ))}

                        {generatedAudios.map((audio, idx) => (
                            <div key={`aud-${idx}`} className="rounded-xl overflow-hidden border border-white/10 bg-[#0f172a] p-3 text-xs">
                                <p className="text-slate-400 mb-2">{audio.prompt.slice(0, 80)}...</p>
                                <audio src={audio.url} controls className="w-full" />
                            </div>
                        ))}

                        {(generatedImages.length + generatedVideos.length + generatedAudios.length === 0) && (
                            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-xl text-slate-500">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-xs">No generations yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISidebar;
