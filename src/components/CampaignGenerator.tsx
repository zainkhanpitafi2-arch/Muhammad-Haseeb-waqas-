import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Settings2, 
  Layout, 
  Smartphone, 
  Mail, 
  Image as ImageIcon,
  Copy,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateCampaign, generateCampaignImage, CampaignData } from '../services/gemini';

export default function CampaignGenerator() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<CampaignData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isCopying, setIsCopying] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setData(null);
    setImageUrl(null);
    
    try {
      const campaign = await generateCampaign(prompt, tone);
      setData(campaign);
      const img = await generateCampaignImage(campaign.imagePrompt);
      setImageUrl(img);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-[320px] border-r border-slate-200 bg-white p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Mail className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">CampaignAI</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generation Engine</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Campaign Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your campaign goals, audience, and offer..."
              className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Settings2 className="w-3 h-3 text-indigo-500" /> Voice & Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Professional', 'Playful', 'Urgent', 'Inspirational'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t.toLowerCase())}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    tone === t.toLowerCase() 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Generate Campaign
              </>
            )}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
              Pro Tip: Detailed prompts result in higher conversion copy and more accurate visuals.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
        {/* Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Status: <span className={data ? "text-emerald-600 font-bold" : "text-slate-400"}>
                {data ? "Ready to Export" : "Pending Prompt"}
              </span>
            </span>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-slate-100 text-indigo-600 shadow-inner' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Layout className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-slate-100 text-indigo-600 shadow-inner' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {data && (
               <>
                 <button className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Send Test</button>
                 <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all active:scale-95">Schedule Send</button>
               </>
             )}
          </div>
        </header>

        <div className="p-12 flex-1 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
          
          <AnimatePresence mode="wait">
            {!data && !isGenerating ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[80vh] flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Mail className="w-10 h-10 text-[#141414]/20" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to launch?</h2>
                  <p className="text-[#141414]/40 max-w-sm mx-auto">
                    Input your campaign details on the left to generate content and visuals.
                  </p>
                </div>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[80vh] flex flex-col items-center justify-center gap-8"
              >
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [20, 60, 20] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      className="w-2 bg-[#141414]"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">Brewing your campaign...</p>
                  <p className="text-[#141414]/40 text-sm">Generating copy, subject lines, and visuals</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  {/* Subject Lines Selector */}
                  <div className="flex gap-2 items-center bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
                    <div className="px-3 py-1.5 text-[9px] uppercase font-bold text-slate-400 border-r border-slate-100">
                      A/B Variants
                    </div>
                    {data?.subjectLines.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSubject(i)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                          selectedSubject === i ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Line Display */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Selected Subject</span>
                    <h3 className="font-bold text-slate-800 tracking-tight">
                      {data?.subjectLines[selectedSubject]}
                    </h3>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(data?.subjectLines[selectedSubject] || '')}
                    className="p-2 text-slate-300 hover:text-indigo-600 transition-all"
                  >
                    {isCopying ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Email Canvas */}
                <div className={`transition-all duration-500 mx-auto ${viewMode === 'mobile' ? 'max-w-sm' : 'w-full'}`}>
                  <div className="bg-white rounded-xl shadow-2xl shadow-slate-900/5 overflow-hidden border border-slate-200">
                    {/* Visual Asset */}
                    <div className="aspect-video bg-slate-50 relative overflow-hidden group">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt="Campaign Visual" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                          <RefreshCw className="w-8 h-8 animate-spin" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">Generating Visual Asset</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-2 shadow-lg border border-slate-100">
                          <ImageIcon className="w-3 h-3 text-indigo-500" /> AI Generated Content
                        </span>
                      </div>
                    </div>

                    {/* Email Copy */}
                    <div className="p-10 space-y-8">
                      <div className="text-center">
                        <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 font-sans italic opacity-80 underline underline-offset-4 decoration-indigo-200">Official Communication</p>
                      </div>
                      
                      <div className="prose prose-slate max-w-none">
                        <div className="markdown-body">
                          <ReactMarkdown>{data?.body || ''}</ReactMarkdown>
                        </div>
                      </div>
                      
                      <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-8">
                        <button className="bg-indigo-600 text-white px-10 py-3 rounded-full font-extrabold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                          SHOP THE OFFER
                        </button>
                        
                        <div className="text-center pb-4">
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                            You are receiving this communication as a valued member.<br/>
                            Manage your preferences or unsubscribe at any time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Exports */}
                <div className="flex justify-center gap-4 pb-12">
                   <button 
                    onClick={() => copyToClipboard(data?.body || '')}
                    className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg border border-slate-200 font-bold text-xs text-slate-600 shadow-sm hover:shadow-md transition-all active:scale-95"
                   >
                     {isCopying ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                     Export Copy
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </main>
  </div>
);
}
