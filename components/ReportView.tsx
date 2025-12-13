import React, { useState } from 'react';
import { MarketingBrief } from '../types';
import { generateStrategyReport } from '../services/gemini';
import { FileText, Download, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

export const ReportView: React.FC<{ brief: MarketingBrief }> = ({ brief }) => {
  const [reportHtml, setReportHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const html = await generateStrategyReport(brief);
      setReportHtml(html);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Marketing Strategy Report - ${brief.productName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>body { padding: 40px; font-family: sans-serif; }</style>
          </head>
          <body>
            ${reportHtml}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!brief.productName) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm border-dashed">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Project Context</h3>
        <p className="text-gray-500 max-w-md mt-2">
          Please fill out the brief in the Campaign Studio first to generate a customized strategy report.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Strategy Report</h2>
           <p className="text-gray-500 text-sm mt-1">AI-Generated Comprehensive Documentation</p>
        </div>
        <div className="flex gap-3">
          {!reportHtml && (
             <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              Generate Full Report
            </button>
          )}
          {reportHtml && (
            <>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Regenerate
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all"
              >
                <Download size={16} />
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {loading && !reportHtml && (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-gray-200">
           <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
           <p className="text-gray-500 font-medium">Drafting your strategy document...</p>
           <p className="text-xs text-gray-400 mt-2">This may take a few seconds</p>
        </div>
      )}

      {reportHtml && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 min-h-[800px] animate-fade-in-up">
           <div className="h-2 bg-indigo-600 w-full"></div>
           <div className="p-12 prose prose-indigo max-w-none">
              <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
           </div>
        </div>
      )}
    </div>
  );
};