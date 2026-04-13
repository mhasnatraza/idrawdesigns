import {
    Sparkles, Wand2, Image as ImageIcon, Zap, History, Video, Send, MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { IDD } from '../services/brain';

const AISidebar = ({ onPlaceOnCanvas }) => {
    const [prompt, setPrompt] = useState('');
    const [mode, setMode] = useState('image');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedAssets, setGeneratedAssets] = useState([]);
    const [chat, setChat] = useState([
        { role: 'assistant', text: 'I am WDD Partner 2 (W2). Describe what you want to draw or generate.' }
    ]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        const userPrompt = prompt.trim();
        setChat(prev => [...prev, { role: 'user', text: userPrompt }]);

        try {
            const enhancedPrompt = IDD.direct(userPrompt, { mode });

            if (mode === 'image') {
                const encoded = encodeURIComponent(enhancedPrompt);
                const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&nologo=true`;

                const img = new Image();
                img.src = url;
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });

                setGeneratedAssets(prev => [{ type: 'image', url, prompt: enhancedPrompt }, ...prev]);
                setChat(prev => [...prev, { role: 'assistant', text: 'Image concept generated. You can send it to canvas.' }]);
            } else {
                const storyboard = [
                    'Scene 1: Establishing shot with bold composition',
                    'Scene 2: Product/subject focus with camera movement',
                    'Scene 3: End frame with CTA and brand mood'
                ];
                setGeneratedAssets(prev => [{ type: 'video', prompt: enhancedPrompt, storyboard }, ...prev]);
                setChat(prev => [...prev, { role: 'assistant', text: 'Video concept created with a 3-scene storyboard.' }]);
            }

            setPrompt('');
        } catch (e) {
            console.error(e);
            setChat(prev => [...prev, { role: 'assistant', text: 'Generation failed. Please retry.' }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-[360px] bg-[#1e293b] border-l border-white/5 flex flex-col h-full glass-panel">
            <div className="p-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    We Draw Design · WDD / W2
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">Canvas-first AI partner for image and video concepts.</p>
            </div>

            <div className="p-4 space-y-4 border-b border-white/5">
                <div className="flex items-center gap-2 bg-[#0f172a]/60 p-1 rounded-lg border border-white/10">
                    <button
                        className={`flex-1 h-8 rounded-md text-xs font-medium ${mode === 'image' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                        onClick={() => setMode('image')}
                    >
                        <ImageIcon className="w-3.5 h-3.5 inline mr-1" /> Image
                    </button>
                    <button
                        className={`flex-1 h-8 rounded-md text-xs font-medium ${mode === 'video' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                        onClick={() => setMode('video')}
                    >
                        <Video className="w-3.5 h-3.5 inline mr-1" /> Video
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400">Describe your concept</label>
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
                            placeholder={mode === 'image' ? 'Luxury perfume poster with cinematic shadows...' : '15 second launch teaser for a fashion drop...'}
                        />
                        <button
                            className="absolute bottom-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            title="Enhance prompt"
                            onClick={() => setPrompt((prev) => `Commercial-grade, art-directed, ${prev}`)}
                        >
                            <Wand2 className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isGenerating ? 'Creating...' : `Generate ${mode === 'image' ? 'Image' : 'Video Idea'}`}
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
                <div className="space-y-3">
                    <h3 className="text-xs font-medium text-slate-400 flex items-center justify-between">
                        W2 Chat
                        <MessageSquare className="w-3 h-3" />
                    </h3>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {chat.map((item, idx) => (
                            <div
                                key={`${item.role}-${idx}`}
                                className={`text-xs rounded-lg p-2 border ${item.role === 'assistant' ? 'bg-[#0f172a] border-white/10 text-slate-200' : 'bg-purple-900/30 border-purple-400/20 text-purple-100'}`}
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-medium text-slate-400 flex items-center justify-between">
                        Generated Assets
                        <History className="w-3 h-3" />
                    </h3>

                    <div className="grid gap-4">
                        {generatedAssets.map((asset, idx) => (
                            <div key={idx} className="group rounded-xl overflow-hidden border border-white/10 bg-[#0f172a]">
                                {asset.type === 'image' ? (
                                    <>
                                        <div className="aspect-square">
                                            <img src={asset.url} className="w-full h-full object-cover" alt="Generated" />
                                        </div>
                                        <div className="p-2 border-t border-white/10 flex gap-2">
                                            <button
                                                className="flex-1 px-2 py-1.5 bg-white text-black text-xs font-medium rounded-lg"
                                                onClick={() => onPlaceOnCanvas?.(asset.url)}
                                            >
                                                Send to Canvas
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-3 space-y-2">
                                        <div className="text-xs text-white flex items-center gap-2"><Video className="w-3 h-3" /> Video Concept</div>
                                        <ul className="text-[11px] text-slate-300 list-disc pl-4 space-y-1">
                                            {asset.storyboard.map((line) => (
                                                <li key={line}>{line}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                        {generatedAssets.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-xl text-slate-500">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-xs">No generations yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Private workspace mode</span>
                <Send className="w-3.5 h-3.5" />
            </div>
        </div>
    );
};

export default AISidebar;
