import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, Loader2, FileText, X, Sparkles } from 'lucide-react';
import { analyzeUploadedMedia } from '../services/gemini';

interface MediaAnalyzerProps {
    language: string;
}

export const MediaAnalyzer: React.FC<MediaAnalyzerProps> = ({ language }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult('');
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setAnalyzing(true);
        try {
            const analysis = await analyzeUploadedMedia(file, language);
            setResult(analysis);
        } catch (error) {
            console.error(error);
            setResult("Error analyzing media. Please try a smaller file or image.");
        } finally {
            setAnalyzing(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">AI Media Analyzer</h2>
                <p className="text-gray-500">Upload photos or videos to get instant marketing insights in {language}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div 
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all h-80 relative ${file ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
                    >
                        {file ? (
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                                {file.type.startsWith('video') ? (
                                    <video src={previewUrl!} controls className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <img src={previewUrl!} alt="Preview" className="max-h-full max-w-full object-contain" />
                                )}
                                <button 
                                    onClick={clearFile}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-gray-600 rounded-full hover:text-red-500 shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload size={32} />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Upload Media</h3>
                                <p className="text-sm text-gray-500 mb-4">Click to browse (Images & Short Videos)</p>
                                <div className="flex gap-2 text-xs text-gray-400 uppercase font-semibold">
                                    <span className="flex items-center gap-1"><ImageIcon size={12}/> JPG, PNG</span>
                                    <span className="flex items-center gap-1"><Video size={12}/> MP4, WebM</span>
                                </div>
                            </div>
                        )}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*,video/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!file || analyzing}
                        className={`mt-4 w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${!file || analyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
                    >
                        {analyzing ? (
                            <><Loader2 className="animate-spin" size={20} /> Analyzing Media...</>
                        ) : (
                            <><FileText size={20} /> Analyze Content</>
                        )}
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[320px]">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Sparkles className="text-indigo-600" size={18} /> 
                        AI Analysis Result
                    </h3>
                    
                    {result ? (
                        <div className="prose prose-sm prose-indigo max-w-none overflow-y-auto flex-1">
                            <div className="whitespace-pre-wrap">{result}</div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <FileText size={24} className="opacity-50" />
                            </div>
                            <p>Upload a file and click analyze to see insights here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};