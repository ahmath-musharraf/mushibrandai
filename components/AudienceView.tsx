import React from 'react';
import { AudienceAnalysis } from '../types';
import { User, MapPin, Briefcase, Users, Heart, Frown, ShoppingCart, CheckCircle, Zap } from 'lucide-react';

interface AudienceViewProps {
  analysis: AudienceAnalysis;
}

export const AudienceView: React.FC<AudienceViewProps> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Demographics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
             <User size={24} />
           </div>
           <div>
             <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Age Range</div>
             <div className="text-lg font-bold text-gray-900">{analysis.demographics.ageRange}</div>
           </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
             <Users size={24} />
           </div>
           <div>
             <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gender</div>
             <div className="text-lg font-bold text-gray-900">{analysis.demographics.gender}</div>
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
             <MapPin size={24} />
           </div>
           <div>
             <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Location</div>
             <div className="text-lg font-bold text-gray-900">{analysis.demographics.location}</div>
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
             <Briefcase size={24} />
           </div>
           <div>
             <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Income</div>
             <div className="text-lg font-bold text-gray-900">{analysis.demographics.incomeLevel}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Psychographics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Heart className="text-rose-500" size={20} /> Interests & Lifestyle
           </h3>
           <div className="flex flex-wrap gap-2">
             {analysis.psychographics.map((item, i) => (
               <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium border border-rose-100">
                 {item}
               </span>
             ))}
           </div>
        </div>

        {/* Pain Points */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Frown className="text-orange-500" size={20} /> Key Pain Points
           </h3>
           <ul className="space-y-3">
             {analysis.painPoints.map((point, i) => (
               <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                 <div className="mt-0.5 min-w-[6px] h-1.5 rounded-full bg-orange-400"></div>
                 {point}
               </li>
             ))}
           </ul>
        </div>

        {/* Buying Behavior */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <ShoppingCart className="text-indigo-600" size={20} /> Buying Behavior
           </h3>
           
           <div className="space-y-4 flex-1">
             <div>
               <div className="text-xs text-gray-500 font-bold uppercase mb-1">Habits</div>
               <p className="text-sm text-gray-800">{analysis.buyingBehavior.spendingHabits}</p>
             </div>
             <div>
               <div className="text-xs text-gray-500 font-bold uppercase mb-1">Price Sensitivity</div>
               <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full ${analysis.buyingBehavior.priceSensitivity.toLowerCase().includes('high') ? 'bg-red-500 w-[90%]' : analysis.buyingBehavior.priceSensitivity.toLowerCase().includes('low') ? 'bg-green-500 w-[20%]' : 'bg-yellow-500 w-[60%]'}`}
                     ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{analysis.buyingBehavior.priceSensitivity}</span>
               </div>
             </div>
             <div>
               <div className="text-xs text-gray-500 font-bold uppercase mb-1">Decision Factors</div>
               <div className="space-y-1">
                 {analysis.buyingBehavior.decisionFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                       <Zap size={10} className="text-yellow-500 fill-yellow-500" /> {factor}
                    </div>
                 ))}
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
