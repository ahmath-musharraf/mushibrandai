import React, { useState, useEffect, useRef } from 'react';
import { GoogleAd, MetaAd, LinkedInAd, TwitterAd, TikTokAd, Competitor } from '../types';
import { Globe, MoreHorizontal, ThumbsUp, MessageCircle, Share2, Star, ExternalLink, RefreshCw, Image as ImageIcon, Edit2, Copy, Check, Search, X, Plus, Sun, Moon, Linkedin, Heart, Repeat, BarChart2, MessageSquare, Users, TrendingUp, DollarSign, Target, Music2, Clapperboard, Video, Send, Ban, Download, Settings, Eye, EyeOff, Film, User, Facebook, Square, Smartphone, Monitor, Twitter, Zap, Wand2, Loader2, Bookmark, Music } from 'lucide-react';
import { generateCreativeImage } from '../services/gemini';

// Helper for auto-resizing textareas
const AutoResizeTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [props.value]);

  return (
    <textarea
      ref={textareaRef}
      {...props}
      rows={1}
      className={`overflow-hidden resize-none bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded px-1 -mx-1 transition-all outline-none ${props.className}`}
    />
  );
};

const SeamlessInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input 
            {...props}
            className={`bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded px-1 -mx-1 transition-all outline-none ${props.className}`}
        />
    )
}

// Toggle Switch Component
const ToggleSwitch = ({ label, checked, onChange, isDark }: { label: string, checked: boolean, onChange: (checked: boolean) => void, isDark?: boolean }) => (
    <div className="flex items-center justify-between gap-3 py-1.5">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{label}</span>
        <button 
            onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
            className={`w-8 h-4 rounded-full relative transition-colors ${checked ? 'bg-indigo-500' : (isDark ? 'bg-gray-600' : 'bg-gray-300')}`}
        >
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm`} style={{ left: checked ? 'calc(100% - 14px)' : '2px' }}></div>
        </button>
    </div>
);

const downloadImage = (url: string, prefix: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prefix}_creative_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Google Ad Mockup ---

interface GoogleAdCardProps {
  ad: GoogleAd;
  onUpdate: (ad: GoogleAd) => void;
  productDescription?: string;
}

export const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ ad, onUpdate, productDescription }) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Image Gen State
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [showImageGen, setShowImageGen] = useState(false);
  
  // Display settings state
  const [showSettings, setShowSettings] = useState(false);
  const [showRatings, setShowRatings] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Derived values
  const currentImagePrompt = ad.imagePrompt !== undefined ? ad.imagePrompt : (productDescription || ad.description);
  const currentNegativePrompt = ad.negativePrompt || "";

  const handleChange = (field: keyof GoogleAd, value: string | Competitor[]) => {
    onUpdate({ ...ad, [field]: value });
  };

  const handleCompetitorChange = (index: number, field: keyof Competitor, value: string) => {
    const newCompetitors = ad.competitors ? [...ad.competitors] : [];
    if (!newCompetitors[index]) {
        newCompetitors[index] = { name: '', strategy: '', spend: '' };
    }
    newCompetitors[index] = { ...newCompetitors[index], [field]: value };
    handleChange('competitors', newCompetitors);
  };

  const handleCopy = () => {
    const text = `Google Search Ad\nHeadline 1: ${ad.headline}\n${ad.headlinePart2 ? `Headline 2: ${ad.headlinePart2}` : ''}\nDescription: ${ad.description}\nKeywords: ${ad.keywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateImage = async () => {
    if (loadingImage) return;
    setLoadingImage(true);
    try {
      const url = await generateCreativeImage(currentImagePrompt, currentNegativePrompt, aspectRatio);
      setImageUrl(url);
      setShowImageGen(false);
    } catch (e) {
      console.error("Failed to generate image", e);
    } finally {
      setLoadingImage(false);
    }
  };

  const removeKeyword = (index: number) => {
    const nextKeywords = [...ad.keywords];
    nextKeywords.splice(index, 1);
    onUpdate({ ...ad, keywords: nextKeywords });
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
        onUpdate({ ...ad, keywords: [...ad.keywords, newKeyword.trim()] });
        setNewKeyword("");
    }
  };

  const handleKeywordClick = (kw: string) => {
    setSearchTerm(kw);
    if (searchInputRef.current) {
        searchInputRef.current.focus();
    }
  };

  const theme = isDarkMode ? {
    bg: "bg-[#202124]",
    border: "border-gray-700",
    textPrimary: "text-[#bdc1c6]",
    textSecondary: "text-[#9aa0a6]",
    textLink: "text-[#8ab4f8]",
    textUrl: "text-[#bdc1c6]",
    compBg: "bg-[#303134]",
    compBorder: "border-gray-600",
    inputBg: "bg-[#303134]",
    inputBorder: "border-gray-600"
  } : {
    bg: "bg-white",
    border: "border-gray-200",
    textPrimary: "text-gray-600",
    textSecondary: "text-gray-500",
    textLink: "text-[#1a0dab]",
    textUrl: "text-gray-700",
    compBg: "bg-gray-50",
    compBorder: "border-gray-200",
    inputBg: "bg-white",
    inputBorder: "border-gray-300"
  };

  const displayCompetitors = ad.competitors && ad.competitors.length > 0 
    ? ad.competitors 
    : [{ name: '', strategy: '', spend: '' }, { name: '', strategy: '', spend: '' }];

  return (
    <div className={`${theme.bg} ${theme.border} border rounded-lg p-4 shadow-sm hover:shadow-md transition-all relative group duration-300`}>
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-full shadow-sm border transition-all opacity-0 group-hover:opacity-100 ${showSettings ? 'opacity-100 bg-indigo-50 text-indigo-600 border-indigo-200' : (isDarkMode ? 'bg-[#303134] text-gray-300 border-gray-600 hover:text-white' : 'bg-white/90 text-gray-500 hover:text-indigo-600 border-gray-200 hover:bg-gray-50')}`}>
          <Settings size={14} />
        </button>
        {showSettings && (
             <div className={`absolute top-10 right-0 w-48 p-3 rounded-lg shadow-xl border z-30 ${isDarkMode ? 'bg-[#303134] border-gray-600' : 'bg-white border-gray-100'}`}>
                 <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Display Options</div>
                 <ToggleSwitch label="Seller Ratings" checked={showRatings} onChange={setShowRatings} isDark={isDarkMode} />
             </div>
        )}
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full shadow-sm border transition-all opacity-0 group-hover:opacity-100 ${isDarkMode ? 'bg-[#303134] text-gray-300 border-gray-600 hover:text-white' : 'bg-white/90 text-gray-500 hover:text-indigo-600 border-gray-200 hover:bg-gray-50'}`}>
          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button onClick={handleCopy} className={`p-2 rounded-full shadow-sm border transition-all opacity-0 group-hover:opacity-100 ${isDarkMode ? 'bg-[#303134] text-gray-300 border-gray-600 hover:text-white' : 'bg-white/90 text-gray-500 hover:text-indigo-600 border-gray-200 hover:bg-gray-50'}`}>
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
        </button>
      </div>

      <div className="relative">
        <div className="mb-5 relative">
            <div className="relative group/search">
                <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className={`w-full pl-10 pr-8 py-2 rounded-full border outline-none shadow-sm text-sm transition-all placeholder-gray-400 ${isDarkMode ? 'bg-[#303134] border-gray-600 text-white focus:border-gray-500' : 'bg-gray-50/50 border-gray-200 text-gray-700 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50/50 focus:bg-white'}`} 
                    placeholder="Simulate Google Search..." 
                />
                <Search className={`absolute left-3.5 top-2.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} size={16} />
                {searchTerm && <button onClick={() => setSearchTerm('')} className={`absolute right-3 top-2.5 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}><X size={16} /></button>}
            </div>
        </div>
        <div className="flex items-center gap-2 mb-1 pr-16">
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sponsored</span>
            <span className={`text-[10px] ${theme.textSecondary}`}>•</span>
            <div className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}><Globe size={10} /></div>
            <span className={`text-xs ${theme.textUrl}`}>example.com</span>
            </div>
            <MoreHorizontal size={14} className={`${theme.textSecondary} ml-auto`} />
        </div>
        <div className="mb-1">
            <div className={`flex flex-col sm:flex-row sm:items-center gap-1 text-xl ${theme.textLink} font-medium leading-tight w-full`}>
                <SeamlessInput 
                    value={ad.headline} 
                    onChange={(e) => handleChange('headline', e.target.value)} 
                    className={`w-full sm:w-auto flex-1 ${theme.textLink} font-medium min-w-[50px] placeholder-current opacity-90`} 
                    placeholder="Headline 1" 
                />
                <span className="hidden sm:inline text-gray-400">-</span>
                <SeamlessInput 
                    value={ad.headlinePart2 || ''} 
                    onChange={(e) => handleChange('headlinePart2', e.target.value)} 
                    className={`w-full sm:w-auto flex-1 ${theme.textLink} font-medium min-w-[50px] placeholder-current opacity-90`} 
                    placeholder="Headline 2 (Optional)" 
                />
            </div>
        </div>
        <AutoResizeTextarea value={ad.description} onChange={(e) => handleChange('description', e.target.value)} className={`text-sm ${theme.textPrimary} leading-normal w-full`} placeholder="Ad description goes here..." />
        
        {showRatings && (
            <div className="flex items-center gap-2 mt-2 select-none">
                <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => (<Star key={i} size={14} className="text-yellow-400 fill-current" />))}</div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>4.8</span>
                <span className={`text-sm ${theme.textSecondary}`}>(2.4k reviews)</span>
            </div>
        )}
        
        <div className={`mt-3 flex gap-4 text-sm ${theme.textLink}`}>
            <span className="hover:underline cursor-pointer">Contact Us</span>
            <span className="hover:underline cursor-pointer">Our Services</span>
            <span className="hover:underline cursor-pointer">Pricing</span>
        </div>
        <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider ${theme.textSecondary}`}>Image Extension</span>
                {!imageUrl && !showImageGen && (
                    <button 
                        onClick={() => setShowImageGen(true)} 
                        className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors font-medium ${isDarkMode ? 'bg-[#303134] border-gray-600 text-[#8ab4f8] hover:bg-gray-700' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}
                    >
                        <ImageIcon size={14}/> Create Image Extension
                    </button>
                )}
            </div>
            
            {(showImageGen && !imageUrl) && (
                <div className={`p-4 rounded-lg border mb-3 ${theme.inputBg} ${theme.inputBorder}`}>
                    <div className="space-y-3">
                         <div>
                            <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${theme.textSecondary}`}>Prompt</label>
                            <textarea
                                value={currentImagePrompt}
                                onChange={(e) => handleChange('imagePrompt', e.target.value)}
                                className={`w-full text-sm p-2 rounded border focus:ring-2 focus:ring-indigo-200 outline-none ${theme.inputBorder} ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                                rows={2}
                                placeholder="Describe the image..."
                            />
                         </div>
                         <div className="flex gap-4">
                             <div className="flex-1">
                                <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${theme.textSecondary}`}>Aspect Ratio</label>
                                <div className="flex gap-2">
                                    {[
                                        { label: '1:1', value: '1:1' },
                                        { label: 'Landscape', value: '1.91:1' },
                                        { label: '4:3', value: '4:3' }
                                    ].map((r) => (
                                        <button
                                            key={r.value}
                                            onClick={() => setAspectRatio(r.value)}
                                            className={`px-2 py-1 text-xs rounded border transition-colors ${aspectRatio === r.value ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : `${theme.inputBorder} ${theme.textSecondary} hover:bg-gray-100`}`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                             </div>
                             <div className="flex-1">
                                <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${theme.textSecondary}`}>Negative Prompt</label>
                                <input
                                    value={currentNegativePrompt}
                                    onChange={(e) => handleChange('negativePrompt', e.target.value)}
                                    className={`w-full text-xs p-1.5 rounded border focus:ring-1 focus:ring-indigo-200 outline-none ${theme.inputBorder} ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}
                                    placeholder="Blur, text, distorted..."
                                />
                             </div>
                         </div>
                         <div className="flex justify-end gap-2 mt-2">
                             <button onClick={() => setShowImageGen(false)} className={`text-xs px-3 py-1.5 rounded hover:bg-gray-100 ${theme.textSecondary}`}>Cancel</button>
                             <button onClick={handleGenerateImage} disabled={loadingImage} className="text-xs px-4 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1.5">
                                 {loadingImage ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                 Generate
                             </button>
                         </div>
                    </div>
                </div>
            )}

            {imageUrl && (
            <div className={`relative rounded-lg overflow-hidden border mt-2 group/gimage ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <img src={imageUrl} alt="Ad extension" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/gimage:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => { setImageUrl(null); setShowImageGen(true); }} className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:bg-gray-50 flex items-center gap-1"><Edit2 size={12} /> Edit</button>
                    <button onClick={handleGenerateImage} disabled={loadingImage} className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:bg-gray-50 flex items-center gap-1"><RefreshCw size={12} className={loadingImage ? "animate-spin" : ""} /> Regenerate</button>
                    <button onClick={(e) => { e.stopPropagation(); downloadImage(imageUrl, 'google_ad'); }} className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm hover:bg-gray-50 flex items-center gap-1"><Download size={12} /> Download</button>
                </div>
            </div>
            )}
        </div>
      </div>
      
      {/* Competitor Analysis Section */}
      <div className={`mt-5 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
         <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 ${theme.textSecondary}`}>
            <Users size={14} className="text-indigo-500" /> Competitor Intelligence
         </h4>
         <div className="space-y-4">
            {displayCompetitors.map((comp, idx) => (
                <div key={idx} className={`rounded-xl p-4 border transition-all ${theme.compBg} ${theme.compBorder} hover:shadow-sm`}>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        {/* Name Input */}
                        <div className="flex-1">
                            <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${theme.textSecondary}`}>Competitor Name</label>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all`}>
                                <Target size={14} className="text-indigo-400" />
                                <input 
                                    type="text"
                                    value={comp.name} 
                                    onChange={(e) => handleCompetitorChange(idx, 'name', e.target.value)}
                                    className={`text-sm font-semibold w-full bg-transparent outline-none ${theme.textPrimary}`}
                                    placeholder="e.g. Competitor X"
                                />
                            </div>
                        </div>
                        
                        {/* Spend Input */}
                        <div className="sm:w-1/3">
                            <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${theme.textSecondary}`}>Est. Monthly Spend</label>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-300 transition-all`}>
                                <DollarSign size={14} className="text-green-500" />
                                <input 
                                    type="text"
                                    value={comp.spend} 
                                    onChange={(e) => handleCompetitorChange(idx, 'spend', e.target.value)}
                                    className="text-sm font-semibold w-full bg-transparent outline-none text-green-600"
                                    placeholder="$0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Strategy Input */}
                    <div>
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${theme.textSecondary}`}>Strategy Analysis</label>
                        <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all`}>
                            <TrendingUp size={14} className="text-gray-400 mt-1 shrink-0" />
                            <AutoResizeTextarea 
                                value={comp.strategy}
                                onChange={(e) => handleCompetitorChange(idx, 'strategy', e.target.value)}
                                className={`text-sm w-full leading-relaxed !border-none !ring-0 !p-0 !m-0 focus:!border-none focus:!ring-0 hover:!border-none ${theme.textPrimary}`}
                                placeholder="Analyze their ad strategy..."
                            />
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>

      <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <span className={`text-xs font-semibold uppercase tracking-wider ${theme.textSecondary}`}>Keywords</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {ad.keywords.map((kw, i) => (
            <div 
                key={i} 
                onClick={() => handleKeywordClick(kw)} 
                className={`group/tag flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer border transition-all shadow-sm ${isDarkMode ? 'bg-gradient-to-r from-[#303134] to-[#3c4043] border-[#5f6368] text-[#8ab4f8]' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 text-blue-700'} hover:shadow-md hover:scale-[1.02] select-none`} 
                title="Click to search"
            >
                <span className="font-medium">{kw}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); removeKeyword(i); }} 
                    className={`p-0.5 rounded-full transition-all focus:outline-none opacity-60 group-hover/tag:opacity-100 ${isDarkMode ? 'hover:bg-white/10 hover:text-red-400' : 'hover:bg-white/50 hover:text-red-500'}`}
                >
                    <X size={14} />
                </button>
             </div>
          ))}
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-[#303134] border-gray-600 focus-within:border-gray-400' : 'bg-gray-50 border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100'}`}>
             <Plus size={12} className={`${theme.textSecondary}`} />
             <input type="text" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addKeyword()} onBlur={addKeyword} placeholder="Add keyword" className={`bg-transparent border-none outline-none text-xs w-24 placeholder-gray-400 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Meta Ad Mockup ---

interface MetaAdCardProps {
  ad: MetaAd;
  productName: string;
  onUpdate: (ad: MetaAd) => void;
}

export const MetaAdCard: React.FC<MetaAdCardProps> = ({ ad, productName, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");

  // Display Settings
  const [showSettings, setShowSettings] = useState(false);
  const [showLikes, setShowLikes] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [showShares, setShowShares] = useState(true);

  const handleChange = (field: keyof MetaAd, value: string) => {
    onUpdate({ ...ad, [field]: value });
  };

  const handleCopy = () => {
    const text = `Meta Ad (${productName})\nPrimary Text: ${ad.primaryText}\nHeadline: ${ad.headline}\nLink Description: ${ad.linkDescription}\nImage Prompt: ${ad.imagePrompt}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateImage = async () => {
    if (loadingImage) return;
    setLoadingImage(true);
    try {
      const url = await generateCreativeImage(ad.imagePrompt, ad.negativePrompt, aspectRatio);
      setImageUrl(url);
    } catch (e) {
      console.error("Failed to generate image", e);
    } finally {
      setLoadingImage(false);
    }
  };

    const theme = isDarkMode ? {
        bg: "bg-[#242526]",
        border: "border-gray-700",
        textPrimary: "text-[#e4e6eb]",
        textSecondary: "text-[#b0b3b8]",
        ctaBg: "bg-[#3a3b3c]",
        ctaBorder: "border-[#3e4042]",
        ctaButton: "bg-[#4e4f50] text-[#e4e6eb] hover:bg-[#5e5f60]",
        actionHover: "hover:bg-[#3a3b3c]",
        iconColor: "text-[#b0b3b8]",
        inputBg: "bg-[#3a3b3c]",
        inputBorder: "border-[#3e4042]"
      } : {
        bg: "bg-white",
        border: "border-gray-200",
        textPrimary: "text-gray-900",
        textSecondary: "text-gray-500",
        ctaBg: "bg-gray-50",
        ctaBorder: "border-gray-100",
        ctaButton: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        actionHover: "hover:bg-gray-50",
        iconColor: "text-gray-600",
        inputBg: "bg-white",
        inputBorder: "border-gray-200"
      };

    const getAspectRatioClass = () => {
        switch(aspectRatio) {
            case "1:1": return "aspect-square";
            case "16:9": return "aspect-video";
            case "9:16": return "aspect-[9/16]";
            case "4:3": return "aspect-[4/3]";
            case "3:4": return "aspect-[3/4]";
            default: return "aspect-square";
        }
    }

  return (
    <div className={`${theme.bg} ${theme.border} border rounded-lg overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 max-w-md mx-auto w-full flex flex-col relative group`}>
      <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} flex justify-between items-center ${isDarkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
         <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center text-white shadow-sm">
                <Facebook size={12} strokeWidth={3} />
             </div>
             <span className={`text-xs font-bold tracking-wide ${theme.textPrimary}`}>Facebook / Instagram Ad</span>
         </div>
         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative">
             <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded-full transition-all ${showSettings ? (isDarkMode ? 'bg-gray-600 text-white' : 'bg-indigo-100 text-indigo-600') : (isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500')}`}>
                 <Settings size={12} />
             </button>
             {showSettings && (
                 <div className={`absolute top-8 right-0 w-44 p-3 rounded-lg shadow-xl border z-30 ${isDarkMode ? 'bg-[#242526] border-gray-600' : 'bg-white border-gray-100'}`}>
                     <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Social Proof</div>
                     <ToggleSwitch label="Likes" checked={showLikes} onChange={setShowLikes} isDark={isDarkMode} />
                     <ToggleSwitch label="Comments" checked={showComments} onChange={setShowComments} isDark={isDarkMode} />
                     <ToggleSwitch label="Shares" checked={showShares} onChange={setShowShares} isDark={isDarkMode} />
                 </div>
             )}
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
              {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
            </button>
            <button onClick={handleCopy} className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            </button>
         </div>
      </div>

      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">{productName.charAt(0)}</div>
          <div>
            <div className={`text-sm font-semibold ${theme.textPrimary}`}>{productName}</div>
            <div className={`text-xs ${theme.textSecondary} flex items-center gap-1`}>Sponsored <Globe size={10} /></div>
          </div>
        </div>
        <MoreHorizontal size={20} className={theme.textSecondary} />
      </div>

      <div className="px-3 pb-3">
        <AutoResizeTextarea value={ad.primaryText} onChange={(e) => handleChange('primaryText', e.target.value)} className={`text-sm ${theme.textPrimary} w-full`} placeholder="Primary text..." />
      </div>

      <div className={`relative w-full ${getAspectRatioClass()} flex items-center justify-center group/image overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#18191a]' : 'bg-gray-100'}`}>
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Ad Creative" className={`w-full h-full object-cover transition-opacity duration-300 ${loadingImage ? 'opacity-50 blur-sm' : 'opacity-100'}`} />
            {loadingImage && (<div className="absolute inset-0 flex items-center justify-center z-10"><RefreshCw size={32} className="text-indigo-600 animate-spin" /></div>)}
            <div className={`absolute inset-0 bg-black/40 transition-opacity flex flex-col items-center justify-center gap-3 p-4 ${loadingImage ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover/image:opacity-100'}`}>
                 <button onClick={(e) => { e.stopPropagation(); handleGenerateImage(); }} disabled={loadingImage} className="w-40 bg-white text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2"><RefreshCw size={14} className={loadingImage ? "animate-spin" : ""} /> Regenerate</button>
                 <button onClick={(e) => { e.stopPropagation(); downloadImage(imageUrl, 'meta_ad'); }} className="w-40 bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-lg flex items-center justify-center gap-2"><Download size={14} /> Download</button>
                 <button onClick={(e) => { e.stopPropagation(); setImageUrl(null); }} className="w-40 bg-white/90 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2"><Edit2 size={14} /> Edit Prompt</button>
            </div>
          </>
        ) : (
          <div className="text-center p-6 w-full px-8 h-full flex flex-col justify-center">
             <div className="w-full text-left space-y-4">
                 <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${theme.textSecondary}`}>
                        <ImageIcon size={12} /> Image Prompt
                    </label>
                    <textarea
                        value={ad.imagePrompt}
                        onChange={(e) => handleChange('imagePrompt', e.target.value)}
                        className={`w-full text-sm p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary}`}
                        rows={3}
                        placeholder="Describe the ad creative in detail..."
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${theme.textSecondary}`}>Aspect Ratio</label>
                        <div className="grid grid-cols-2 gap-2">
                             {[
                                 { label: 'Square', value: '1:1', icon: <Square size={12} /> },
                                 { label: 'Vertical', value: '9:16', icon: <Smartphone size={12} /> },
                                 { label: 'Wide', value: '16:9', icon: <Monitor size={12} /> },
                                 { label: 'Portrait', value: '3:4', icon: <div className="w-2 h-3 border border-current rounded-[1px]" /> }
                             ].map((ratio) => (
                                  <button
                                     key={ratio.value}
                                     onClick={(e) => { e.preventDefault(); setAspectRatio(ratio.value); }}
                                     className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded text-[10px] font-medium transition-all border ${
                                         aspectRatio === ratio.value 
                                             ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                             : `${theme.inputBg} ${theme.inputBorder} ${theme.textSecondary} hover:bg-gray-50 hover:text-gray-900`
                                     }`}
                                  >
                                     {ratio.icon} {ratio.label}
                                  </button>
                             ))}
                        </div>
                     </div>
                     
                     <div>
                        <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`}>
                            <Ban size={10} /> Negative Prompt
                        </label>
                         <textarea
                            value={ad.negativePrompt || ''}
                            onChange={(e) => handleChange('negativePrompt', e.target.value)}
                            className={`w-full text-xs p-2 rounded-lg border focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ${theme.inputBg} ${isDarkMode ? 'border-rose-900/30 text-rose-300 placeholder-rose-800' : 'border-rose-100 text-rose-800 placeholder-rose-300'}`}
                            rows={3}
                            placeholder="Blur, text, low quality..."
                        />
                     </div>
                 </div>
                 
                 <button onClick={handleGenerateImage} disabled={loadingImage} className="mt-2 w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                    {loadingImage ? <><RefreshCw size={18} className="animate-spin" /> Generating High-Quality Creative...</> : <><Wand2 size={18} /> Generate Creative</>}
                 </button>
             </div>
          </div>
        )}
      </div>

      <div className={`${theme.ctaBg} p-3 border-b ${theme.ctaBorder}`}>
        <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0 mr-2">
                <div className={`text-xs ${theme.textSecondary} uppercase`}>example.com</div>
                <SeamlessInput value={ad.headline} onChange={(e) => handleChange('headline', e.target.value)} className={`text-sm font-bold w-full ${theme.textPrimary}`} placeholder="Headline" />
                <SeamlessInput value={ad.linkDescription} onChange={(e) => handleChange('linkDescription', e.target.value)} className={`text-xs w-full ${theme.textSecondary}`} placeholder="Link description" />
            </div>
            <button className={`px-4 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap ${theme.ctaButton}`}>Learn more</button>
        </div>
        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-dashed border-opacity-20 border-gray-400">
             <button className={`text-xs px-3 py-1.5 rounded border transition-all duration-200 ${isDarkMode ? 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-400' : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-white'}`}>Shop Now</button>
             <button className={`text-xs px-3 py-1.5 rounded border transition-all duration-200 ${isDarkMode ? 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-400' : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-white'}`}>Sign Up</button>
             <button className={`text-xs px-3 py-1.5 rounded border transition-all duration-200 ${isDarkMode ? 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-400' : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 hover:bg-white'}`}>Visit Website</button>
        </div>
      </div>

      {(showLikes || showComments || showShares) && (
        <div className={`px-3 py-2 flex items-center justify-between text-xs sm:text-sm border-t ${theme.ctaBorder} ${theme.bg} ${theme.textSecondary}`}>
            <div className="flex items-center gap-2">
            {showLikes && (
                <>
                    <div className="flex -space-x-1">
                        <div className={`w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center border-2 z-10 ${isDarkMode ? 'border-[#242526]' : 'border-white'}`}><ThumbsUp size={10} className="text-white fill-white" /></div>
                        <div className={`w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 ${isDarkMode ? 'border-[#242526]' : 'border-white'}`}><span className="text-[10px] leading-none">❤️</span></div>
                    </div>
                    <span className="hover:underline cursor-pointer">2.5K</span>
                </>
            )}
            </div>
            <div className="flex gap-3">
             {showComments && <div className="flex items-center gap-1 hover:underline cursor-pointer"><span className="font-medium">48</span> Comments</div>}
             {showShares && <div className="flex items-center gap-1 hover:underline cursor-pointer"><span className="font-medium">15</span> Shares</div>}
            </div>
        </div>
      )}
      
      <div className={`px-2 py-1 flex items-center justify-between border-t ${theme.ctaBorder}`}>
        <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors ${theme.iconColor} ${theme.actionHover}`}><ThumbsUp size={18} /> Like</button>
        <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors ${theme.iconColor} ${theme.actionHover}`}><MessageCircle size={18} /> Comment</button>
        <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors ${theme.iconColor} ${theme.actionHover}`}><Share2 size={18} /> Share</button>
      </div>
    </div>
  );
};

// --- LinkedIn Ad Mockup ---

interface LinkedInAdCardProps {
  ad: LinkedInAd;
  productName: string;
  onUpdate: (ad: LinkedInAd) => void;
}

export const LinkedInAdCard: React.FC<LinkedInAdCardProps> = ({ ad, productName, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const handleChange = (field: keyof LinkedInAd, value: string) => {
    onUpdate({ ...ad, [field]: value });
  };

  const handleGenerateImage = async () => {
    if (loadingImage) return;
    setLoadingImage(true);
    try {
      const url = await generateCreativeImage(ad.imagePrompt, ad.negativePrompt, "1.91:1"); // Landscape usually for LinkedIn
      setImageUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all max-w-md mx-auto overflow-hidden font-sans">
      {/* Header */}
      <div className="p-3 flex justify-between items-start">
         <div className="flex gap-2">
             <div className="w-10 h-10 bg-indigo-900 rounded-sm text-white flex items-center justify-center font-bold text-lg">{productName.charAt(0)}</div>
             <div>
                 <div className="text-sm font-semibold text-gray-900 leading-tight">{productName}</div>
                 <div className="text-xs text-gray-500 leading-tight">12,504 followers</div>
                 <div className="text-xs text-gray-500 leading-tight flex items-center gap-1">Promoted <Globe size={10} /></div>
             </div>
         </div>
         <MoreHorizontal size={18} className="text-gray-500" />
      </div>

      {/* Content */}
      <div className="px-3 pb-2">
          <AutoResizeTextarea 
             value={ad.introText}
             onChange={(e) => handleChange('introText', e.target.value)}
             className="text-sm text-gray-800 w-full mb-1"
             placeholder="Intro text..."
          />
      </div>

      {/* Image / Creative */}
      <div className="bg-gray-100 aspect-[1.91/1] w-full relative group flex items-center justify-center overflow-hidden">
         {imageUrl ? (
            <>
               <img src={imageUrl} className="w-full h-full object-cover" alt="Ad Creative" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button onClick={handleGenerateImage} className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium"><RefreshCw size={12} className={loadingImage ? "animate-spin" : ""} /> Regenerate</button>
                   <button onClick={() => downloadImage(imageUrl, 'linkedin_ad')} className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium"><Download size={12} /></button>
               </div>
            </>
         ) : (
             <div className="text-center p-4 w-full">
                 <p className="text-xs text-gray-500 mb-2 italic px-8">{ad.imagePrompt}</p>
                 <button onClick={handleGenerateImage} disabled={loadingImage} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-2 mx-auto hover:bg-indigo-700">
                     {loadingImage ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Generate Creative
                 </button>
             </div>
         )}
      </div>

      {/* CTA Strip */}
      <div className="bg-gray-50 p-3 flex justify-between items-center border-t border-gray-100">
         <div className="flex-1 mr-2">
             <SeamlessInput 
                value={ad.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="text-sm font-semibold text-gray-900 w-full"
                placeholder="Headline"
             />
             <div className="text-xs text-gray-500">example.com</div>
         </div>
         <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
             {ad.ctaLabel}
         </button>
      </div>

      {/* Social Actions */}
      <div className="p-2 border-t border-gray-100 flex justify-between text-gray-500">
          <button className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded text-sm font-medium"><ThumbsUp size={16} /> Like</button>
          <button className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded text-sm font-medium"><MessageSquare size={16} /> Comment</button>
          <button className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded text-sm font-medium"><Repeat size={16} /> Repost</button>
          <button className="flex items-center gap-1.5 p-2 hover:bg-gray-100 rounded text-sm font-medium"><Send size={16} /> Send</button>
      </div>
    </div>
  );
};


// --- Twitter Ad Mockup ---

interface TwitterAdCardProps {
  ad: TwitterAd;
  productName: string;
  onUpdate: (ad: TwitterAd) => void;
}

export const TwitterAdCard: React.FC<TwitterAdCardProps> = ({ ad, productName, onUpdate }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleChange = (field: keyof TwitterAd, value: string) => {
    onUpdate({ ...ad, [field]: value });
  };
  
  const handleGenerateImage = async () => {
    if (loadingImage) return;
    setLoadingImage(true);
    try {
      const url = await generateCreativeImage(ad.imagePrompt, undefined, "16:9"); 
      setImageUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all max-w-md mx-auto p-4 font-sans">
        <div className="flex gap-3">
             <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold shrink-0">{productName.charAt(0)}</div>
             <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1 text-[15px] leading-5">
                         <span className="font-bold text-gray-900 truncate">{productName}</span>
                         <span className="text-blue-400"><Check size={12} strokeWidth={4} className="bg-blue-100 rounded-full p-[1px]" /></span>
                         <span className="text-gray-500 truncate">@{productName.replace(/\s/g, '').toLowerCase()}</span>
                         <span className="text-gray-500">·</span>
                         <span className="text-gray-500 text-xs">Ad</span>
                     </div>
                     <MoreHorizontal size={16} className="text-gray-500" />
                 </div>
                 
                 <AutoResizeTextarea 
                    value={ad.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    className="w-full text-[15px] text-gray-900 mt-1 mb-2 leading-normal"
                    placeholder="Tweet text..."
                 />

                 {/* Media Container */}
                 <div className="mt-2 rounded-2xl overflow-hidden border border-gray-200 relative group aspect-video bg-slate-50 flex items-center justify-center">
                    {imageUrl ? (
                        <>
                           <img src={imageUrl} className="w-full h-full object-cover" alt="Tweet Image" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                               <button onClick={handleGenerateImage} className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold"><RefreshCw size={12} className={loadingImage ? "animate-spin" : ""} /> Regenerate</button>
                               <button onClick={() => downloadImage(imageUrl, 'twitter_ad')} className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold"><Download size={12} /></button>
                           </div>
                           <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">Promoted</div>
                        </>
                    ) : (
                        <div className="text-center p-6 w-full">
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ad.imagePrompt}</p>
                            <button onClick={handleGenerateImage} disabled={loadingImage} className="bg-sky-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center justify-center gap-2 mx-auto hover:bg-sky-600 transition-colors">
                                {loadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />} Generate Media
                            </button>
                        </div>
                    )}
                 </div>
                 
                 {/* Website Card Strip */}
                 <div className="mt-0 bg-gray-50 rounded-b-2xl border-x border-b border-gray-200 p-3 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between -mt-1 rounded-t-none">
                     <div className="flex items-center gap-2 text-gray-500 text-sm">
                         <ExternalLink size={14} />
                         <span className="truncate max-w-[200px]">{ad.websiteUrl || 'example.com'}</span>
                     </div>
                     <button className="bg-white border border-gray-300 px-3 py-1 rounded-full text-xs font-bold text-gray-900">Open</button>
                 </div>

                 {/* Actions */}
                 <div className="flex justify-between mt-3 text-gray-500 max-w-sm">
                     <button className="group flex items-center gap-1 hover:text-blue-500"><MessageSquare size={16} className="group-hover:bg-blue-50 rounded-full p-0.5" /><span className="text-xs">12</span></button>
                     <button className="group flex items-center gap-1 hover:text-green-500"><Repeat size={16} className="group-hover:bg-green-50 rounded-full p-0.5" /><span className="text-xs">8</span></button>
                     <button className="group flex items-center gap-1 hover:text-pink-500"><Heart size={16} className="group-hover:bg-pink-50 rounded-full p-0.5" /><span className="text-xs">56</span></button>
                     <button className="group flex items-center gap-1 hover:text-blue-500"><BarChart2 size={16} className="group-hover:bg-blue-50 rounded-full p-0.5" /><span className="text-xs">2.1K</span></button>
                     <button className="hover:text-blue-500"><Share2 size={16} /></button>
                 </div>
             </div>
        </div>
    </div>
  );
};


// --- TikTok Ad Mockup ---

interface TikTokAdCardProps {
  ad: TikTokAd;
  productName: string;
  onUpdate: (ad: TikTokAd) => void;
}

export const TikTokAdCard: React.FC<TikTokAdCardProps> = ({ ad, productName, onUpdate }) => {
  const handleChange = (field: keyof TikTokAd, value: any) => {
    onUpdate({ ...ad, [field]: value });
  };

  return (
    <div className="bg-black text-white rounded-[30px] border-4 border-gray-800 shadow-2xl max-w-sm mx-auto overflow-hidden relative aspect-[9/19] flex flex-col group">
        {/* Top Status Bar Mockup */}
        <div className="absolute top-0 w-full px-6 py-3 flex justify-between items-center z-20 text-xs font-semibold">
            <span>9:41</span>
            <div className="flex gap-1">
                <div className="w-4 h-2.5 bg-white rounded-sm"></div>
                <div className="w-0.5 h-2.5 bg-white rounded-sm"></div>
            </div>
        </div>

        {/* Video Area Placeholder */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6">
            <div className="text-center space-y-6 w-full">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-left border border-white/10 hover:border-white/30 transition-colors">
                     <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Zap size={10} className="text-yellow-400" /> The Hook</label>
                     <AutoResizeTextarea 
                        value={ad.hook}
                        onChange={(e) => handleChange('hook', e.target.value)}
                        className="w-full bg-transparent text-lg font-bold text-white placeholder-white/30"
                        placeholder="Catchy opening hook..."
                     />
                </div>
                
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-left border border-white/10 hover:border-white/30 transition-colors">
                     <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Film size={10} className="text-blue-400" /> Visual Cues</label>
                     <AutoResizeTextarea 
                        value={ad.visualCues}
                        onChange={(e) => handleChange('visualCues', e.target.value)}
                        className="w-full bg-transparent text-sm text-gray-200 placeholder-white/30"
                        placeholder="What's happening on screen..."
                     />
                </div>
            </div>

            {/* Right Side Interactions */}
            <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 z-20">
                 <div className="relative">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs border border-white shadow-lg">{productName.charAt(0)}</div>
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">+</div>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <Heart size={28} className="text-white fill-white/20 hover:fill-red-500 transition-colors cursor-pointer drop-shadow-md" />
                     <span className="text-xs font-semibold shadow-black drop-shadow-md">84.2K</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <MessageCircle size={28} className="text-white fill-white/20 drop-shadow-md" />
                     <span className="text-xs font-semibold shadow-black drop-shadow-md">1024</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <Bookmark size={28} className="text-white fill-white/20 drop-shadow-md" />
                     <span className="text-xs font-semibold shadow-black drop-shadow-md">4.5K</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <Share2 size={28} className="text-white fill-white/20 drop-shadow-md" />
                     <span className="text-xs font-semibold shadow-black drop-shadow-md">Share</span>
                 </div>
            </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-20 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="mb-2 font-semibold text-white shadow-black drop-shadow-md text-sm">@{productName.replace(/\s/g, '').toLowerCase()}</div>
            <div className="mb-3 text-sm text-white/90 shadow-black drop-shadow-md pr-12">
                 <AutoResizeTextarea 
                    value={ad.script}
                    onChange={(e) => handleChange('script', e.target.value)}
                    className="w-full bg-transparent text-sm placeholder-white/50"
                    placeholder="Caption / Script..."
                 />
                 <div className="flex flex-wrap gap-1 mt-1 text-white font-bold">
                    {ad.hashtags.map((tag, i) => (
                        <span key={i}>#{tag.replace('#', '')}</span>
                    ))}
                 </div>
            </div>
            <div className="flex items-center gap-2 text-white/90 animate-pulse">
                <Music size={14} />
                <div className="text-xs overflow-hidden w-40 whitespace-nowrap">
                   <span className="inline-block">{ad.musicSuggestion} - Original Sound</span>
                </div>
            </div>
        </div>
    </div>
  );
};
