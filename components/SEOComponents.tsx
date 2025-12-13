import React, { useState } from 'react';
import { SEOContent, BlogPostIdea } from '../types';
import { Search, MoreVertical, Smartphone, Monitor, BookOpen, Hash, ArrowUpRight, Copy, Check } from 'lucide-react';

interface SEOViewProps {
    seoContent: SEOContent;
}

export const SEOView: React.FC<SEOViewProps> = ({ seoContent }) => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SERPSimulator metaTitle={seoContent.metaTitle} metaDescription={seoContent.metaDescription} />
                <KeywordStrategy organicKeywords={seoContent.organicKeywords} h1Tag={seoContent.h1Tag} />
            </div>
            
            <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="text-indigo-600" size={20} />
                    Content Strategy & Blog Ideas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {seoContent.blogPostIdeas.map((idea, idx) => (
                        <BlogIdeaCard key={idx} idea={idea} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SERPSimulator: React.FC<{ metaTitle: string, metaDescription: string }> = ({ metaTitle, metaDescription }) => {
    const [isMobile, setIsMobile] = useState(true);
    const [title, setTitle] = useState(metaTitle);
    const [desc, setDesc] = useState(metaDescription);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Search size={16} /> SERP Preview
                </h3>
                <div className="flex bg-gray-200 rounded-lg p-1">
                    <button 
                        onClick={() => setIsMobile(true)}
                        className={`p-1.5 rounded-md transition-all ${isMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Smartphone size={16} />
                    </button>
                    <button 
                        onClick={() => setIsMobile(false)}
                        className={`p-1.5 rounded-md transition-all ${!isMobile ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Monitor size={16} />
                    </button>
                </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-6">
                {/* Visual Preview */}
                <div className="bg-white p-4 rounded-lg border border-dashed border-gray-200">
                    <div className={isMobile ? "max-w-sm mx-auto" : "w-full"}>
                        {/* Fake Google Header */}
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-500">G</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-800 font-medium">example.com</span>
                                <span className="text-[10px] text-gray-500">https://www.example.com › ...</span>
                            </div>
                            <MoreVertical size={14} className="ml-auto text-gray-400" />
                        </div>
                        {/* Result */}
                        <div className="mb-1">
                            <h3 className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer leading-tight">
                                {title}
                            </h3>
                        </div>
                        <div className="text-sm text-[#4d5156] leading-normal">
                           {desc}
                        </div>
                    </div>
                </div>

                {/* Editor Inputs */}
                <div className="space-y-4 mt-auto">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 flex justify-between">
                            Meta Title
                            <span className={`${title.length > 60 ? 'text-red-500' : 'text-green-600'}`}>{title.length}/60</span>
                        </label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 flex justify-between">
                            Meta Description
                             <span className={`${desc.length > 160 ? 'text-red-500' : 'text-green-600'}`}>{desc.length}/160</span>
                        </label>
                        <textarea 
                            value={desc} 
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const KeywordStrategy: React.FC<{ organicKeywords: string[], h1Tag: string }> = ({ organicKeywords, h1Tag }) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Hash size={16} /> On-Page Strategy
            </h3>

            <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Primary H1 Tag</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800 text-lg font-bold font-serif">
                    {h1Tag}
                </div>
            </div>

            <div>
                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Target Organic Keywords</label>
                 <div className="flex flex-wrap gap-2">
                    {organicKeywords.map((kw, i) => (
                        <div key={i} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm font-medium flex items-center gap-1 group cursor-default">
                            {kw}
                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                 </div>
                 <p className="text-xs text-gray-400 mt-3 italic">
                    * Incorporate these keywords naturally into your H2 tags and body content.
                 </p>
            </div>
        </div>
    );
};

const BlogIdeaCard: React.FC<{ idea: BlogPostIdea }> = ({ idea }) => {
    const [copied, setCopied] = useState(false);

    const copyOutline = () => {
        navigator.clipboard.writeText(`Title: ${idea.title}\n\nOutline:\n${idea.outline}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow relative group">
            <button 
                onClick={copyOutline}
                className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
            >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
            <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">
                Keyword: {idea.targetKeyword}
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                {idea.title}
            </h4>
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100">
                {idea.outline}
            </div>
        </div>
    );
};