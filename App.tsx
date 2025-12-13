import React, { useState, useEffect } from 'react';
import { MarketingBrief, GeneratedCampaign, AdPlatform, GoogleAd, MetaAd, LinkedInAd, TwitterAd, TikTokAd } from './types';
import { generateMarketingCampaign } from './services/gemini';
import { GoogleAdCard, MetaAdCard, LinkedInAdCard, TwitterAdCard, TikTokAdCard } from './components/AdComponents';
import { SEOView } from './components/SEOComponents';
import { AudienceView } from './components/AudienceView';
import { ExpertChat } from './components/ExpertChat';
import { ReportView } from './components/ReportView';
import { MediaAnalyzer } from './components/MediaAnalyzer';
import { LandingPageView } from './components/LandingPageView';
import { 
  Sparkles, 
  Target, 
  Megaphone, 
  Loader2, 
  CheckCircle2, 
  LayoutDashboard,
  MessageSquare,
  FileText,
  Wand2,
  Menu,
  X,
  Layers,
  Globe,
  Facebook,
  Linkedin,
  Twitter,
  Video,
  Search,
  Copy,
  Activity,
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  LogIn,
  UserCircle,
  Languages,
  Image as ImageIcon,
  LayoutTemplate,
  Lightbulb,
  Rocket,
  Key,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

// Placeholder Logo URL
const LOGO_URL = "https://img.logoipsum.com/297.svg";

// --- API Key Modal Component ---
interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [key, setKey] = useState('');
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f172a] text-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-800 transform transition-all scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none">
                        <Key size={120} />
                    </div>
                    <h2 className="text-xl font-bold flex items-center gap-2 relative z-10">
                        <Key className="w-5 h-5" /> Setup API Key
                    </h2>
                    <p className="text-blue-100 text-sm mt-1 relative z-10">
                        To use MushiBrandAI, you need a free Google Gemini API key.
                    </p>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6">
                    <p className="text-gray-300 text-sm">
                        This application is powered by Google's Gemini models. It requires an API Key to function. Don't worry, it's <span className="font-bold text-white">free</span> for personal use!
                    </p>
                    
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full px-4 py-3 bg-[#1e293b] hover:bg-[#334155] border border-gray-700 rounded-xl transition-colors group text-sm"
                    >
                        <span className="font-medium text-blue-400">Get Free Gemini API Key</span>
                        <ExternalLink size={16} className="text-gray-500 group-hover:text-blue-400" />
                    </a>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Paste your API Key here</label>
                        <input 
                            type="password" 
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full bg-[#020617] border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm"
                        />
                        <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Your key is stored locally in your browser.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                         <button 
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors text-sm"
                         >
                            Cancel
                         </button>
                         <button 
                            onClick={() => onSave(key)}
                            disabled={!key.trim()}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/30 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            <CheckCircle2 size={16} /> Save API Key
                         </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LandingPage: React.FC<{ onLogin: () => void; onGuest: () => void; hasGoogleAuth: boolean }> = ({ onLogin, onGuest, hasGoogleAuth }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 relative z-10 text-center my-auto">
         {(!logoError && LOGO_URL) ? (
             <img 
                src={LOGO_URL} 
                alt="MushiBrandAI Logo" 
                className="w-24 h-auto mx-auto mb-8 drop-shadow-md hover:scale-105 transition-transform duration-300"
                onError={() => setLogoError(true)}
             />
         ) : (
             <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200 hover:scale-105 transition-transform duration-300">
                <Rocket className="text-white w-8 h-8" />
             </div>
         )}
         
         <h1 className="text-3xl font-extrabold text-gray-900 mb-2">MushiBrandAI</h1>
         <p className="text-gray-500 mb-8">
           Your creative studio for digital marketing. Generate unlimited ideas for Google Ads, Meta Ads, and social content instantly.
         </p>

         <div className="space-y-4">
            <button 
              onClick={onLogin}
              className="w-full py-3.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 group"
            >
               {hasGoogleAuth ? (
                   <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Log in with Google
                   </>
               ) : (
                   <>
                       <Key className="w-5 h-5 text-gray-500" />
                       Enter API Key
                   </>
               )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-medium">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              onClick={onGuest}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 flex items-center justify-center gap-2"
            >
               <UserCircle className="w-5 h-5" />
               Continue as Guest
            </button>
         </div>
         
         <p className="mt-8 text-xs text-gray-400">
           By continuing, you agree to our Terms of Service and Privacy Policy.
         </p>
      </div>

      <footer className="w-full py-6 text-center relative z-10 mt-4">
          <p className="text-sm text-gray-500">
              Created by <a href="https://mushieditz.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500 font-semibold hover:underline">Mushi Editz</a>
          </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  // Auth State
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated' | 'guest'>('loading');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);

  // Navigation State
  const [activeModule, setActiveModule] = useState<'campaign' | 'media' | 'landing' | 'experts' | 'report'>('campaign');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data State
  const [step, setStep] = useState<1 | 2>(1);
  const [brief, setBrief] = useState<MarketingBrief>({
    productName: '',
    category: 'E-commerce & Retail',
    description: '',
    targetAudience: '',
    objective: 'Sales',
    platforms: ['Google', 'Meta'],
    language: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
  const [activeTab, setActiveTab] = useState<AdPlatform>(AdPlatform.Audience);
  const [copySuccess, setCopySuccess] = useState(false);

  // Check Authentication Status on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check for Environment Variable API Key (Automatic Detection)
        if (process.env.API_KEY && process.env.API_KEY.length > 0) {
            console.log("API Key detected in environment.");
            setAuthStatus('authenticated');
            return;
        }

        // 2. Check for Project IDX / Google AI Studio environment capabilities
        let idxAuthenticated = false;
        if ((window as any).aistudio) {
            setHasGoogleAuth(true); // Enable "Log in with Google" button
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (hasKey) {
                setAuthStatus('authenticated');
                idxAuthenticated = true;
                return;
            }
        } 
        
        // 3. Check Local Storage
        const localKey = localStorage.getItem('gemini_api_key');
        if (localKey) {
            setAuthStatus('authenticated');
        } else {
            // Only finalize as unauthenticated if no method worked
            if (!idxAuthenticated) {
                setAuthStatus('unauthenticated');
            }
        }
      } catch (e) {
        console.error("Auth check failed", e);
        setAuthStatus('unauthenticated');
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    if ((window as any).aistudio) {
        try {
            await (window as any).aistudio.openSelectKey();
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
             if (hasKey) {
                 setAuthStatus('authenticated');
             } else {
                 setAuthStatus('authenticated');
             }
        } catch (e) {
            console.error(e);
            alert("Login failed. Please try again.");
        }
    } else {
        // Fallback: Open Manual API Key Modal
        setShowApiKeyModal(true);
    }
  };

  const handleSaveKey = (key: string) => {
      localStorage.setItem('gemini_api_key', key);
      setShowApiKeyModal(false);
      setAuthStatus('authenticated');
  };

  const handleGuestAccess = () => {
      setAuthStatus('guest');
  };

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrief(prev => ({ ...prev, [name]: value }));
  };

  const togglePlatform = (platform: string) => {
    setBrief(prev => {
        const current = prev.platforms || [];
        if (current.includes(platform)) {
            return { ...prev, platforms: current.filter(p => p !== platform) };
        } else {
            return { ...prev, platforms: [...current, platform] };
        }
    });
  };

  const handleGenerate = async () => {
    if (authStatus === 'guest') {
        const confirmLogin = window.confirm("Guest mode is for exploration only. Please log in with Google to generate full campaigns with AI. Would you like to log in now?");
        if (confirmLogin) {
            handleLogin();
        }
        return;
    }

    if (!brief.productName || !brief.description) return;
    if (brief.platforms.length === 0) {
        alert("Please select at least one platform.");
        return;
    }
    setLoading(true);
    try {
      const result = await generateMarketingCampaign(brief);
      setCampaign(result);
      setStep(2);
      
      // Default to Audience Analysis view after generation
      setActiveTab(AdPlatform.Audience);

    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("API Key")) {
         setShowApiKeyModal(true); // Re-prompt if key is invalid
      } else {
         alert("Failed to generate campaign. Please check your API key status and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAllAds = () => {
    if (!campaign) return;

    let clipboardText = `Campaign Strategy for ${brief.productName}\n\nStrategy: ${campaign.strategy}\n\n`;

    if (campaign.analytics) {
         clipboardText += `--- Projections ---\nBudget: ${campaign.analytics.estimatedMonthlyBudget}\nResults: ${campaign.analytics.projectedResults.conversions} conversions\n\n`;
    }

    if (campaign.googleAds && campaign.googleAds.length > 0) {
      clipboardText += `--- Google Ads ---\n`;
      campaign.googleAds.forEach((ad, i) => {
        clipboardText += `Ad ${i + 1}:\nHeadline 1: ${ad.headline}\n${ad.headlinePart2 ? `Headline 2: ${ad.headlinePart2}\n` : ''}Description: ${ad.description}\nKeywords: ${ad.keywords.join(', ')}\n\n`;
      });
    }

    if (campaign.metaAds && campaign.metaAds.length > 0) {
      clipboardText += `--- Meta Ads ---\n`;
      campaign.metaAds.forEach((ad, i) => {
        clipboardText += `Ad ${i + 1}:\nPrimary Text: ${ad.primaryText}\nHeadline: ${ad.headline}\nLink Description: ${ad.linkDescription}\nImage Prompt: ${ad.imagePrompt}\n\n`;
      });
    }

    if (campaign.linkedinAds && campaign.linkedinAds.length > 0) {
      clipboardText += `--- LinkedIn Ads ---\n`;
      campaign.linkedinAds.forEach((ad, i) => {
        clipboardText += `Ad ${i + 1}:\nIntro: ${ad.introText}\nHeadline: ${ad.headline}\nCTA: ${ad.ctaLabel}\nImage Prompt: ${ad.imagePrompt}\n\n`;
      });
    }

    if (campaign.twitterAds && campaign.twitterAds.length > 0) {
      clipboardText += `--- Twitter Ads ---\n`;
      campaign.twitterAds.forEach((ad, i) => {
        clipboardText += `Ad ${i + 1}:\nText: ${ad.text}\nImage Prompt: ${ad.imagePrompt}\nURL: ${ad.websiteUrl}\n\n`;
      });
    }

    if (campaign.tiktokAds && campaign.tiktokAds.length > 0) {
      clipboardText += `--- TikTok Ads ---\n`;
      campaign.tiktokAds.forEach((ad, i) => {
        clipboardText += `Ad ${i + 1}:\nHook: ${ad.hook}\nScript: ${ad.script}\nVisuals: ${ad.visualCues}\nMusic: ${ad.musicSuggestion}\nHashtags: ${ad.hashtags.join(' ')}\n\n`;
      });
    }

    navigator.clipboard.writeText(clipboardText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    if (!campaign || !campaign.googleAds) return;
    const newAds = [...campaign.googleAds];
    newAds[index] = updatedAd;
    setCampaign({ ...campaign, googleAds: newAds });
  };

  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    if (!campaign || !campaign.metaAds) return;
    const newAds = [...campaign.metaAds];
    newAds[index] = updatedAd;
    setCampaign({ ...campaign, metaAds: newAds });
  };

  const handleUpdateLinkedInAd = (index: number, updatedAd: LinkedInAd) => {
    if (!campaign || !campaign.linkedinAds) return;
    const newAds = [...campaign.linkedinAds];
    newAds[index] = updatedAd;
    setCampaign({ ...campaign, linkedinAds: newAds });
  };

  const handleUpdateTwitterAd = (index: number, updatedAd: TwitterAd) => {
    if (!campaign || !campaign.twitterAds) return;
    const newAds = [...campaign.twitterAds];
    newAds[index] = updatedAd;
    setCampaign({ ...campaign, twitterAds: newAds });
  };

  const handleUpdateTikTokAd = (index: number, updatedAd: TikTokAd) => {
    if (!campaign || !campaign.tiktokAds) return;
    const newAds = [...campaign.tiktokAds];
    newAds[index] = updatedAd;
    setCampaign({ ...campaign, tiktokAds: newAds });
  };

  const reset = () => {
    setStep(1);
    setCampaign(null);
  };

  const renderContent = () => {
    if (activeModule === 'media') {
        return <MediaAnalyzer language={brief.language} />;
    }

    if (activeModule === 'experts') {
      return <ExpertChat brief={brief} />;
    }
    
    if (activeModule === 'report') {
      return <ReportView brief={brief} />;
    }

    if (activeModule === 'landing') {
        return <LandingPageView content={campaign?.landingPage} />;
    }

    // Default: Campaign Module
    return (
      <div className="max-w-6xl mx-auto">
         {step === 1 && (
          <div className="max-w-2xl mx-auto py-12 animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Creative <span className="text-indigo-600">Studio</span>
              </h2>
              <p className="text-base text-gray-600">
                Transform your product into a full digital marketing campaign.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                        Product / Brand Name
                    </label>
                    <input
                        type="text"
                        name="productName"
                        id="productName"
                        value={brief.productName}
                        onChange={handleInputChange}
                        placeholder="e.g., Lumina Smart Desk"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Industry Category
                        </label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <select
                                name="category"
                                id="category"
                                value={brief.category}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                            >
                                <option value="E-commerce & Retail">E-commerce & Retail</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                                <option value="Education & Training">Education & Training</option>
                                <option value="Technology & SaaS">Technology & SaaS</option>
                                <option value="Finance & Insurance">Finance & Insurance</option>
                                <option value="Travel & Hospitality">Travel & Hospitality</option>
                                <option value="Food & Beverage">Food & Beverage</option>
                                <option value="Entertainment & Media">Entertainment & Media</option>
                                <option value="Automotive">Automotive</option>
                                <option value="Professional Services">Professional Services</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={brief.description}
                    onChange={handleInputChange}
                    placeholder="Describe what you're selling, key features, and benefits..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Audience
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="targetAudience"
                        id="targetAudience"
                        value={brief.targetAudience}
                        onChange={handleInputChange}
                        placeholder="e.g., Remote workers, 25-45"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Language
                    </label>
                    <div className="relative">
                      <Languages className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <select
                        name="language"
                        id="language"
                        value={brief.language}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Sinhala">Sinhala</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-1">
                      Campaign Objective
                    </label>
                    <div className="relative">
                      <Megaphone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <select
                        name="objective"
                        id="objective"
                        value={brief.objective}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white"
                      >
                        <option value="Sales">Sales & Conversions</option>
                        <option value="Leads">Lead Generation</option>
                        <option value="Awareness">Brand Awareness</option>
                        <option value="Traffic">Website Traffic</option>
                      </select>
                    </div>
                  </div>

                {/* Platform Selection */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Creative Platforms</label>
                   <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {['Google', 'Meta', 'LinkedIn', 'Twitter', 'TikTok'].map((p) => {
                            const isSelected = brief.platforms.includes(p);
                            return (
                                <button 
                                    key={p} 
                                    onClick={() => togglePlatform(p)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {p === 'Google' && <Globe size={20} className="mb-1" />}
                                    {p === 'Meta' && <Facebook size={20} className="mb-1" />}
                                    {p === 'LinkedIn' && <Linkedin size={20} className="mb-1" />}
                                    {p === 'Twitter' && <Twitter size={20} className="mb-1" />}
                                    {p === 'TikTok' && <Video size={20} className="mb-1" />}
                                    <span className="text-xs font-medium">{p}</span>
                                </button>
                            );
                        })}
                   </div>
                   <p className="text-xs text-gray-500 mt-2 italic">* SEO strategy is automatically included with every campaign.</p>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !brief.productName || !brief.description}
                  className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg text-white font-semibold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    loading || !brief.productName || !brief.description
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Designing Creatives...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5" />
                      Generate Marketing Ideas
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && campaign && (
          <div className="animate-fade-in-up py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{brief.productName} Campaign</h2>
                <div className="flex items-center gap-3 text-gray-500 text-sm mt-1">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Ideas Generated</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium text-xs">{brief.category}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium text-xs">{brief.language}</span>
                </div>
              </div>
              <div className="flex gap-3">
                 <button 
                  onClick={handleCopyAllAds}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                   {copySuccess ? <CheckCircle2 size={16} className="text-green-600"/> : <Copy size={16} />}
                   {copySuccess ? 'Copied!' : 'Copy All Ads'}
                </button>
                 <button 
                  onClick={reset}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit Brief
                </button>
                <button 
                  onClick={handleGenerate}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
                >
                  <Wand2 size={16} /> Regenerate Ideas
                </button>
              </div>
            </div>

            {/* Strategy Banner */}
            <div className="bg-indigo-900 rounded-xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <h3 className="text-indigo-200 font-semibold uppercase tracking-wider text-sm mb-2">Strategic Angle</h3>
               <p className="text-lg md:text-xl font-light leading-relaxed relative z-10">
                 "{campaign.strategy}"
               </p>
            </div>

            {/* Analytics Dashboard */}
            {campaign.analytics && (
              <div className="mb-8 animate-fade-in-up">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="text-indigo-600" /> Projected Performance & Costs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                   <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-emerald-50 rounded-lg"><DollarSign className="w-5 h-5 text-emerald-600" /></div>
                         <span className="text-sm font-medium text-gray-500">Est. Budget</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{campaign.analytics.estimatedMonthlyBudget}</div>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-blue-50 rounded-lg"><Eye className="w-5 h-5 text-blue-600" /></div>
                         <span className="text-sm font-medium text-gray-500">Impressions</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{campaign.analytics.projectedResults.impressions}</div>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-purple-50 rounded-lg"><MousePointer className="w-5 h-5 text-purple-600" /></div>
                         <span className="text-sm font-medium text-gray-500">Est. Clicks</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{campaign.analytics.projectedResults.clicks}</div>
                   </div>
                   <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-orange-50 rounded-lg"><TrendingUp className="w-5 h-5 text-orange-600" /></div>
                         <span className="text-sm font-medium text-gray-500">{brief.objective === 'Sales' ? 'Est. Sales' : 'Conversions'}</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{campaign.analytics.projectedResults.conversions}</div>
                      <div className="text-xs text-orange-600 font-medium mt-1">ROI: {campaign.analytics.projectedResults.roi}</div>
                   </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                     <Calendar className="text-indigo-600 w-5 h-5" />
                     <h4 className="font-semibold text-gray-800">Best Time to Post Schedule</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {campaign.analytics.bestTimeSchedule.map((item, i) => (
                       <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-3 w-1/3">
                               {item.platform === 'Google' && <Globe size={20} className="text-blue-500" />}
                               {item.platform === 'Meta' && <Facebook size={20} className="text-blue-700" />}
                               {item.platform === 'LinkedIn' && <Linkedin size={20} className="text-blue-800" />}
                               {item.platform === 'Twitter' && <Twitter size={20} className="text-sky-500" />}
                               {item.platform === 'TikTok' && <Video size={20} className="text-pink-600" />}
                              <span className="font-medium text-gray-900">{item.platform}</span>
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                 <Calendar size={14} className="text-indigo-400" />
                                 <span className="font-medium">Days:</span> {item.bestDays}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                 <Clock size={14} className="text-indigo-400" />
                                 <span className="font-medium">Time:</span> {item.bestTimes}
                              </div>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Platform Tabs */}
            <div className="flex space-x-1 rounded-xl bg-gray-200/50 p-1 mb-8 max-w-4xl overflow-x-auto">
              <button
                onClick={() => setActiveTab(AdPlatform.Audience)}
                className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 flex items-center justify-center gap-2 ${
                  activeTab === AdPlatform.Audience
                    ? 'bg-white shadow text-indigo-700'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                }`}
              >
                <Users size={16} /> Audience
              </button>

              {campaign.googleAds && campaign.googleAds.length > 0 && (
                  <button
                    onClick={() => setActiveTab(AdPlatform.Google)}
                    className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                      activeTab === AdPlatform.Google
                        ? 'bg-white shadow text-indigo-700'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`}
                  >
                    Google Search
                  </button>
              )}
              {campaign.metaAds && campaign.metaAds.length > 0 && (
                  <button
                    onClick={() => setActiveTab(AdPlatform.Meta)}
                    className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                      activeTab === AdPlatform.Meta
                        ? 'bg-white shadow text-indigo-700'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`}
                  >
                    Meta (FB/IG)
                  </button>
              )}
               {campaign.linkedinAds && campaign.linkedinAds.length > 0 && (
                  <button
                    onClick={() => setActiveTab(AdPlatform.LinkedIn)}
                    className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                      activeTab === AdPlatform.LinkedIn
                        ? 'bg-white shadow text-indigo-700'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`}
                  >
                    LinkedIn
                  </button>
              )}
              {campaign.twitterAds && campaign.twitterAds.length > 0 && (
                  <button
                    onClick={() => setActiveTab(AdPlatform.Twitter)}
                    className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                      activeTab === AdPlatform.Twitter
                        ? 'bg-white shadow text-indigo-700'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`}
                  >
                    Twitter (X)
                  </button>
              )}
              {campaign.tiktokAds && campaign.tiktokAds.length > 0 && (
                  <button
                    onClick={() => setActiveTab(AdPlatform.TikTok)}
                    className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                      activeTab === AdPlatform.TikTok
                        ? 'bg-white shadow text-indigo-700'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`}
                  >
                    TikTok / Reels
                  </button>
              )}
              {campaign.seoContent && (
                  <button
                    onClick={() => setActiveTab(AdPlatform.SEO)}
                    className={`flex-1 min-w-[120px] rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2 ${
                      activeTab === AdPlatform.SEO
                        ? 'bg-white shadow text-indigo-700'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    }`}
                  >
                    SEO & Content
                  </button>
              )}
            </div>

            {/* Content Area */}
            <div className="space-y-8">
              {activeTab === AdPlatform.Audience && campaign.audienceAnalysis && (
                  <AudienceView analysis={campaign.audienceAnalysis} />
              )}
              {activeTab === AdPlatform.Google && campaign.googleAds && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaign.googleAds.map((ad, idx) => (
                      <GoogleAdCard 
                        key={idx} 
                        ad={ad} 
                        productDescription={brief.description}
                        onUpdate={(updatedAd) => handleUpdateGoogleAd(idx, updatedAd)}
                      />
                    ))}
                </div>
              )}
              {activeTab === AdPlatform.Meta && campaign.metaAds && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.metaAds.map((ad, idx) => (
                    <MetaAdCard 
                        key={idx} 
                        ad={ad} 
                        productName={brief.productName}
                        onUpdate={(updatedAd) => handleUpdateMetaAd(idx, updatedAd)}
                    />
                  ))}
                </div>
              )}
              {activeTab === AdPlatform.LinkedIn && campaign.linkedinAds && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.linkedinAds.map((ad, idx) => (
                    <LinkedInAdCard 
                        key={idx} 
                        ad={ad} 
                        productName={brief.productName}
                        onUpdate={(updatedAd) => handleUpdateLinkedInAd(idx, updatedAd)}
                    />
                  ))}
                </div>
              )}
               {activeTab === AdPlatform.Twitter && campaign.twitterAds && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.twitterAds.map((ad, idx) => (
                    <TwitterAdCard 
                        key={idx} 
                        ad={ad} 
                        productName={brief.productName}
                        onUpdate={(updatedAd) => handleUpdateTwitterAd(idx, updatedAd)}
                    />
                  ))}
                </div>
              )}
              {activeTab === AdPlatform.TikTok && campaign.tiktokAds && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.tiktokAds.map((ad, idx) => (
                    <TikTokAdCard 
                        key={idx} 
                        ad={ad} 
                        productName={brief.productName}
                        onUpdate={(updatedAd) => handleUpdateTikTokAd(idx, updatedAd)}
                    />
                  ))}
                </div>
              )}
              {activeTab === AdPlatform.SEO && campaign.seoContent && (
                  <SEOView seoContent={campaign.seoContent} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Missing App return logic restored here:
  
  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <>
        <LandingPage 
          onLogin={handleLogin} 
          onGuest={handleGuestAccess} 
          hasGoogleAuth={hasGoogleAuth}
        />
        <ApiKeyModal 
          isOpen={showApiKeyModal} 
          onClose={() => setShowApiKeyModal(false)} 
          onSave={handleSaveKey} 
        />
      </>
    );
  }

  const navItems = [
    { id: 'campaign', label: 'Campaign Studio', icon: LayoutDashboard },
    { id: 'media', label: 'Media Analyzer', icon: ImageIcon },
    { id: 'landing', label: 'Landing Page', icon: LayoutTemplate },
    { id: 'experts', label: 'Expert Chat', icon: Users },
    { id: 'report', label: 'Strategy Report', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
             <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg mr-3">
                <Rocket className="text-white w-5 h-5" />
             </div>
             <span className="text-lg font-bold text-gray-900 tracking-tight">MushiBrandAI</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveModule(item.id as any); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeModule === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
             <div className="bg-gray-50 rounded-xl p-4 mb-2">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {brief.productName ? brief.productName.charAt(0) : 'U'}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                         {authStatus === 'guest' ? 'Guest User' : 'Pro Plan'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                         {authStatus === 'guest' ? 'Limited Access' : 'Active'}
                      </p>
                   </div>
                </div>
             </div>
             <button 
                onClick={() => { localStorage.removeItem('gemini_api_key'); setAuthStatus('unauthenticated'); setCampaign(null); }} 
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
             >
                <LogIn className="rotate-180" size={18} /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 md:hidden">
           <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md">
              <Menu size={24} />
           </button>
           <span className="font-bold text-gray-900">MushiBrandAI</span>
           <div className="w-8"></div> 
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
           {renderContent()}
        </main>
      </div>

      <ApiKeyModal 
         isOpen={showApiKeyModal} 
         onClose={() => setShowApiKeyModal(false)} 
         onSave={handleSaveKey} 
      />
    </div>
  );
};
