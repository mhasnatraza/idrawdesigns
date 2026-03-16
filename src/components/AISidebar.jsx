import {
    Sparkles, Wand2, Image as ImageIcon, Zap, History, Lightbulb, X
} from 'lucide-react';
import { useState } from 'react';
import { IDD } from '../services/brain';
import StudioBlueprint from './StudioBlueprint';

const AISidebar = ({ isTabletOrMobile = false, sidebarOpen = true, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [activeTab, setActiveTab] = useState('generate');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        try {
            const enhancedPrompt = IDD.direct(prompt);
            const encoded = encodeURIComponent(enhancedPrompt);
            const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&nologo=true`;

            const img = new Image();
            img.src = url;
            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });

            setGeneratedImages(prev => [{ url, prompt: enhancedPrompt }, ...prev]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!sidebarOpen && isTabletOrMobile) {
        return null;
    }

    return (
        <>
            {isTabletOrMobile && (
                <button
                    className="absolute inset-0 bg-black/50 z-20"
                    onClick={onClose}
                    aria-label="Close panel backdrop"
                />
            )}
            <aside
                className={`
                    ${isTabletOrMobile ? 'absolute right-0 top-0 bottom-0 z-30 w-[88vw] max-w-[360px] shadow-2xl' : 'relative w-[320px]'}
                    bg-[#1e293b] border-l border-white/5 flex flex-col h-full glass-panel
                `}
            >
                <div className="p-4 border-b border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            IDD Intelligence
                        </h2>
                        {isTabletOrMobile && (
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg bg-white/10 text-slate-200"
                                aria-label="Close AI sidebar"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActiveTab('generate')}
                            className={`h-8 text-xs rounded-lg border transition-colors ${activeTab === 'generate' ? 'bg-white/15 border-white/20 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:text-white'}`}
                        >
                            Generate
                        </button>
                        <button
                            onClick={() => setActiveTab('blueprint')}
                            className={`h-8 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1 ${activeTab === 'blueprint' ? 'bg-white/15 border-white/20 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:text-white'}`}
                        >
                            <Lightbulb className="w-3 h-3" /> Plan
                        </button>
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-6">
                    {activeTab === 'generate' ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-slate-400">Describe your vision</label>
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={e => setPrompt(e.target.value)}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                                        placeholder="A futuristic city with neons..."
                                    />
                                    <button
                                        className="absolute bottom-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                                        title="Enhance with AI"
                                        onClick={() => setPrompt(`Ultra realistic, 8k, ${prompt}`)}
                                    >
                                        <Wand2 className="w-3 h-3" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                >
                                    {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    {isGenerating ? 'Dreaming...' : 'Generate Art'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-medium text-slate-400 flex items-center justify-between">
                                    Generated Assets
                                    <History className="w-3 h-3" />
                                </h3>

                                <div className="grid gap-4">
                                    {generatedImages.map((img, idx) => (
                                        <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#0f172a]">
                                            <img src={img.url} className="w-full h-full object-cover" alt="Generated" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="px-3 py-1.5 bg-white text-black text-xs font-medium rounded-lg">
                                                    Drag to Canvas
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {generatedImages.length === 0 && (
                                        <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-xl text-slate-500">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">No generations yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <StudioBlueprint />
                    )}
                </div>
            </aside>
        </>
    );
};

export default AISidebar;
