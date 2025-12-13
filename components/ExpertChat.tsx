import React, { useState, useRef, useEffect } from 'react';
import { ExpertPersona, MarketingBrief, ChatMessage } from '../types';
import { createExpertChatSession } from '../services/gemini';
import { Send, User, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";

const EXPERTS: ExpertPersona[] = [
  {
    id: 'strategist',
    name: 'Sarah, Chief Strategist',
    role: 'Marketing Director',
    avatar: 'bg-emerald-100 text-emerald-600',
    systemInstruction: "You are Sarah, a seasoned Chief Marketing Officer. You focus on high-level strategy, ROI, market positioning, and long-term growth. You ask probing questions about business models and competitive advantages. Keep answers concise and professional."
  },
  {
    id: 'creative',
    name: 'Leo, Creative Director',
    role: 'Creative Lead',
    avatar: 'bg-purple-100 text-purple-600',
    systemInstruction: "You are Leo, a visionary Creative Director. You care about brand voice, storytelling, visual aesthetics, and emotional connection. You hate boring corporate speak. You suggest bold, edgy, or emotional ideas."
  },
  {
    id: 'growth',
    name: 'Max, Growth Hacker',
    role: 'Performance Marketer',
    avatar: 'bg-orange-100 text-orange-600',
    systemInstruction: "You are Max, a Growth Hacker. You are obsessed with CAC, LTV, CTR, and A/B testing. You suggest tactical, quick-win experiments, viral loops, and data-driven optimizations."
  }
];

interface ExpertChatProps {
  brief: MarketingBrief;
}

export const ExpertChat: React.FC<ExpertChatProps> = ({ brief }) => {
  const [selectedExpert, setSelectedExpert] = useState<ExpertPersona>(EXPERTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'model',
    text: `Hi, I'm ${EXPERTS[0].name.split(',')[0]}. I've reviewed your brief for ${brief.productName || 'your product'}. How can I help refine your strategy today?`
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref to store the active chat session
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat when expert changes
  useEffect(() => {
    chatSessionRef.current = createExpertChatSession(selectedExpert, brief);
    setMessages([{
      role: 'model',
      text: `Hi, I'm ${selectedExpert.name.split(',')[0]}. I've reviewed your brief for ${brief.productName || 'your product'}. How can I help refine your strategy today?`
    }]);
  }, [selectedExpert, brief]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = createExpertChatSession(selectedExpert, brief);
      }

      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]); // Add placeholder

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        fullResponse += text;
        
        // Update the last message with the accumulating text
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullResponse;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!brief.productName) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Brief Found</h3>
        <p className="text-gray-500 max-w-md mt-2">Please go to the "Campaign Studio" tab and fill out your product details first so the experts have context.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar - Expert Selection */}
      <div className="w-1/3 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Boardroom</h3>
          <p className="text-xs text-gray-500">Select an expert to consult</p>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {EXPERTS.map(expert => (
            <button
              key={expert.id}
              onClick={() => setSelectedExpert(expert)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                selectedExpert.id === expert.id 
                  ? 'bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expert.avatar} font-bold`}>
                {expert.name.charAt(0)}
              </div>
              <div>
                <div className={`font-medium text-sm ${selectedExpert.id === expert.id ? 'text-indigo-900' : 'text-gray-900'}`}>
                  {expert.name}
                </div>
                <div className="text-xs text-gray-500">{expert.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedExpert.avatar} text-xs font-bold`}>
              {selectedExpert.name.charAt(0)}
           </div>
           <div>
             <h3 className="font-semibold text-gray-800 text-sm">{selectedExpert.name}</h3>
             <p className="text-xs text-gray-500 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               Online
             </p>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ${selectedExpert.name.split(',')[0]} a question...`}
              disabled={isTyping}
              className="flex-1 px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              {isTyping ? <Sparkles size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};