import React from 'react';
import { Sparkles, Cookie, History, MessageCircle, Home } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: 'troubleshoot' | 'history' | 'chat';
  setActiveTab: (tab: 'troubleshoot' | 'history' | 'chat') => void;
  onOpenGlobalChat: () => void;
}

export function MobileFrame({ children, activeTab, setActiveTab, onOpenGlobalChat }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#F2F0EB] text-[#2D2B28] py-8 px-4 flex flex-col items-center justify-between font-sans antialiased selection:bg-[#E8E4DA] selection:text-[#2D2B28]">
      
      {/* Editorial Decorative Brand Header */}
      <header className="w-full max-w-5xl px-4 py-6 mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-end border-b border-[#D4D1C9] z-10 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-5xl font-serif italic tracking-tight text-[#2D2B28]">Crumb.</h1>
          <p className="text-[10px] uppercase tracking-[0.25em] mt-1.5 text-[#2D2B28]/60 font-medium">Baking Diagnostics & Forensic Science</p>
        </div>
        <div className="flex gap-6 md:gap-8 text-[10px] uppercase tracking-[0.15em] font-bold text-[#2D2B28]">
          <span className={`${activeTab === 'troubleshoot' ? 'border-b-2 border-[#2D2B28] pb-1' : 'opacity-40 hover:opacity-80 transition-opacity cursor-pointer'}`} onClick={() => setActiveTab('troubleshoot')}>Investigation Flow</span>
          <span className={`${activeTab === 'history' ? 'border-b-2 border-[#2D2B28] pb-1' : 'opacity-40 hover:opacity-80 transition-opacity cursor-pointer'}`} onClick={() => setActiveTab('history')}>Journal Archive</span>
          <span className={`${activeTab === 'chat' ? 'border-b-2 border-[#2D2B28] pb-1' : 'opacity-40 hover:opacity-80 transition-opacity cursor-pointer'}`} onClick={() => setActiveTab('chat')}>Pantry Science</span>
        </div>
      </header>

      {/* Main Simulated Phone Frame */}
      <div className="w-full max-w-[412px] h-[780px] bg-white rounded-[40px] shadow-2xl border-[6px] border-[#2D2B28] flex flex-col overflow-hidden relative z-10 transition-all duration-300">
        {/* Notch & Sensor bar (styled high-contrast editorial) */}
        <div className="absolute top-0 inset-x-0 h-7 bg-[#2D2B28] flex items-center justify-between px-6 z-45 pointer-events-none">
          <span className="text-[9px] font-bold text-[#F2F0EB]/90 font-mono">09:14</span>
          {/* Physical camera notch circle */}
          <div className="w-16 h-3 bg-[#1F1E1C] rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-[#F2F0EB]/80 font-mono">
            {/* Battery Indicator */}
            <div className="w-4 h-2 border border-[#F2F0EB]/40 rounded-2xs p-0.5 flex items-center">
              <div className="h-full w-2 bg-[#FAF9F6] rounded-3xs" />
            </div>
            <span className="text-[8px] font-bold">100%</span>
          </div>
        </div>

        {/* Dynamic Screen Content Wrapper */}
        <div className="flex-1 pt-7 pb-16 overflow-y-auto overflow-x-hidden relative flex flex-col bg-[#FAF9F6]">
          {children}
        </div>

        {/* Global Floating AI Companion Trigger Indicator */}
        <button
          onClick={onOpenGlobalChat}
          id="global-chat-companion"
          className="absolute bottom-20 right-4 p-3.5 bg-[#2D2B28] hover:bg-[#8B735B] text-white rounded-full shadow-lg border border-[#F2F0EB]/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group z-40 cursor-pointer"
          title="Ask Chef Crumb"
        >
          <Sparkles className="h-5 w-5 text-[#E8E4DA] animate-pulse group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B735B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FAF9F6]"></span>
          </div>
        </button>

        {/* Bottom Tab Bar Navigation */}
        <nav className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-[#D4D1C9] px-6 flex items-center justify-around z-30">
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
              activeTab === 'troubleshoot' ? 'text-[#2D2B28] font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <Home className="h-4.5 w-4.5" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">Diagnose</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
              activeTab === 'history' ? 'text-[#2D2B28] font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <History className="h-4.5 w-4.5" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">History</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
              activeTab === 'chat' ? 'text-[#2D2B28] font-bold' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <MessageCircle className="h-4.5 w-4.5" />
            <span className="text-[9px] uppercase tracking-wider font-semibold">Chef AI</span>
          </button>
        </nav>
      </div>

      {/* Editorial Decorative Brand Footer */}
      <footer className="w-full max-w-5xl p-6 flex flex-col md:flex-row justify-between items-center bg-[#2D2B28] text-[#F2F0EB] rounded-2xl mt-10 gap-4 z-10">
        <div className="text-[9px] uppercase tracking-widest opacity-60">Case Study: Sourdough Failure Forensic Labs</div>
        <div className="flex gap-6 items-center text-[9px] uppercase tracking-[0.15em] font-bold text-[#F2F0EB]/90">
          <span className="hover:text-white transition-colors cursor-pointer">Bread Logic</span>
          <span className="hover:text-white transition-colors cursor-pointer">Oven Thermodynamics</span>
          <span className="hover:text-white transition-colors cursor-pointer">Hydration Tables</span>
        </div>
      </footer>

    </div>
  );
}
