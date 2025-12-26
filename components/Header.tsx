
import React, { useState } from 'react';
import { Search, Bell, Zap, Menu, ChevronDown, MessageSquare, Sparkles, Glasses } from 'lucide-react';
import PricingModal from './PricingModal'; // Import pricing

interface HeaderProps {
  toggleSidebar: () => void;
  credits: number;
  onOpenProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, credits, onOpenProfile }) => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
    <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onSuccess={() => {}} />
    
    <header className="h-16 bg-[#0B0E14] border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 text-brand-text shrink-0 relative overflow-hidden">
      
      {/* Festive Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-brand-muted hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Logo Area - Photo Smart Style */}
        <div className="flex items-center gap-3 select-none cursor-pointer group">
           <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              {/* Glossy Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
              <Glasses className="w-6 h-6 text-white relative z-10 drop-shadow-md" />
           </div>
           <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                 <span className="font-bold text-white text-lg leading-none tracking-tight font-sans drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-purple-200 transition-colors duration-300">Photo Smart</span>
                 <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                   AI
                 </span>
              </div>
              <span className="text-[10px] text-brand-muted font-medium tracking-wide">
                 Умный редактор
              </span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Desktop Helper Icons */}
        <div className="hidden md:flex items-center gap-1">
           <button className="p-2 text-brand-muted hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
             <Bell className="w-4 h-4" />
             <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
           </button>
        </div>
        
        <div className="h-6 w-px bg-white/10 hidden md:block"></div>

        {/* Credits Badge */}
        <div 
          onClick={() => setShowPricing(true)}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-sm hover:bg-white/10 transition-colors cursor-pointer group"
        >
           <div className="bg-yellow-500/20 p-1 rounded-full group-hover:bg-yellow-500/30 transition-colors">
              <Zap className="w-3 h-3 text-yellow-400" fill="currentColor" />
           </div>
           <span className="text-xs font-bold text-white tabular-nums">
             {credits} <span className="text-brand-muted font-normal ml-0.5">кр.</span>
           </span>
        </div>
        
        {/* Tariff Button (Desktop) */}
        <button 
          onClick={() => setShowPricing(true)}
          className="hidden sm:flex items-center gap-2 bg-brand-accent hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <span>Тариф PRO</span>
        </button>
        
        {/* User Avatar */}
        <button 
          className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={onOpenProfile}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] ring-2 ring-black border border-white/20 shadow-lg relative">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-[#151921]" />
             <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0E14] rounded-full"></div>
          </div>
        </button>
      </div>
    </header>
    </>
  );
};

export default Header;
