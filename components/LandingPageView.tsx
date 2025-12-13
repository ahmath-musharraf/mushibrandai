import React, { useState } from 'react';
import { LandingPageContent } from '../types';
import { generateCreativeImage } from '../services/gemini';
import { LayoutTemplate, RefreshCw, Image as ImageIcon, CheckCircle, ArrowRight, MessageSquare, HelpCircle, AlertCircle } from 'lucide-react';

interface LandingPageViewProps {
  content?: LandingPageContent;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ content }) => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleGenerateHeroImage = async () => {
    if (!content?.hero.imagePrompt || loadingImage) return;
    setLoadingImage(true);
    try {
      const url = await generateCreativeImage(content.hero.imagePrompt);
      setHeroImage(url);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImage(false);
    }
  };

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
        <LayoutTemplate className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Landing Page Generated</h3>
        <p className="text-gray-500 max-w-md mt-2">
          Generate a campaign first to unlock the Landing Page Creator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Landing Page Creator</h2>
            <p className="text-gray-500 text-sm">AI-generated high-converting structure and copy.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
             Live Mockup
          </div>
      </div>

      {/* Mockup Container (Browser Window Style) */}
      <div className="border border-gray-300 rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* Fake Browser Toolbar */}
        <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 flex items-center gap-4">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded-md h-7 mx-4 flex items-center px-3 text-xs text-gray-500 font-mono">
                your-product-landing-page.com
            </div>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-100">
            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-28">
                        <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline leading-tight">{content.hero.headline}</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    {content.hero.subheadline}
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                                            {content.hero.ctaText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center group relative overflow-hidden">
                    {heroImage ? (
                        <>
                            <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src={heroImage} alt="Hero" />
                             <button 
                                onClick={handleGenerateHeroImage}
                                className="absolute bottom-4 right-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                             >
                                <RefreshCw size={12} /> Regenerate
                             </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-sm text-gray-500 mb-4 max-w-xs">{content.hero.imagePrompt}</p>
                            <button 
                                onClick={handleGenerateHeroImage}
                                disabled={loadingImage}
                                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-100 transition-colors"
                            >
                                {loadingImage ? <RefreshCw className="animate-spin" size={16}/> : <ImageIcon size={16}/>}
                                {loadingImage ? 'Generating AI Image...' : 'Generate Hero Image'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            {content.features.map((feature, idx) => (
                                <div key={idx} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <CheckCircle className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">
                                        {feature.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gray-50 py-16 lg:py-24">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="lg:text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900">Trusted by Experts</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {content.socialProof.map((proof, idx) => (
                             <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
                                <MessageSquare className="absolute top-6 right-6 text-gray-200" size={24} />
                                <p className="text-gray-600 italic mb-4">"{proof.quote}"</p>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {proof.name.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{proof.name}</p>
                                        <p className="text-sm text-gray-500">{proof.role}</p>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white py-16 lg:py-24">
                 <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                     <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
                     <dl className="space-y-6 divide-y divide-gray-200">
                         {content.faq.map((item, idx) => (
                             <div key={idx} className="pt-6">
                                 <dt className="text-lg leading-6 font-medium text-gray-900 flex items-start gap-2">
                                     <HelpCircle size={20} className="mt-1 text-indigo-500 shrink-0" />
                                     {item.question}
                                 </dt>
                                 <dd className="mt-2 ml-7 text-base text-gray-500">
                                     {item.answer}
                                 </dd>
                             </div>
                         ))}
                     </dl>
                 </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-indigo-700">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">{content.hero.headline}</span>
                        <span className="block text-indigo-200 text-xl mt-2">Start your journey today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-200">
                        {content.hero.subheadline}
                    </p>
                    <a href="#" className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto">
                        {content.hero.ctaText} <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};