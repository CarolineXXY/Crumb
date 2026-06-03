import React from 'react';
import { MessageCircle, Home, ClipboardList, User, Sparkles } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: 'troubleshoot' | 'history' | 'chat' | 'profile';
  setActiveTab: (tab: 'troubleshoot' | 'history' | 'chat' | 'profile') => void;
  onOpenGlobalChat?: () => void;
}

export function MobileFrame({ children, activeTab, setActiveTab, onOpenGlobalChat }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2B28] flex flex-col font-sans antialiased selection:bg-[#E8E4DA] selection:text-[#2D2B28]">
      
      {/* Editorial Responsive Main Header */}
      <header className="sticky top-0 bg-[#FAF9F6] border-b border-[#D4D1C9] py-4 px-6 flex justify-between items-center z-40 transition-colors shadow-2xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { setActiveTab('troubleshoot'); }}>
            <span className="text-2xl font-serif italic font-extrabold tracking-tight text-[#2D2B28]">crumb.</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#8B735B]" />
          </div>
          <span className="text-[8px] uppercase tracking-[0.25em] text-[#2D2B28]/60 font-semibold font-sans mt-0.5 max-w-[170px] sm:max-w-none truncate">
            Forensic Baking Intelligence
          </span>
        </div>

        {/* Desktop & Tablet Navigation */}
        <div className="hidden sm:flex gap-6 md:gap-8 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#2D2B28]">
          <button 
            className={`transition-all pb-1 hover:text-[#8B735B] cursor-pointer ${activeTab === 'troubleshoot' ? 'border-b border-[#2D2B28] font-bold text-[#2D2B28]' : 'opacity-60'}`}
            onClick={() => setActiveTab('troubleshoot')}
          >
            Diagnostics
          </button>
          <button 
            className={`transition-all pb-1 hover:text-[#8B735B] cursor-pointer ${activeTab === 'history' ? 'border-b border-[#2D2B28] font-bold text-[#2D2B28]' : 'opacity-60'}`}
            onClick={() => setActiveTab('history')}
          >
            Baking Journal
          </button>
          <button 
            className={`transition-all pb-1 hover:text-[#8B735B] cursor-pointer ${activeTab === 'chat' ? 'border-b border-[#2D2B28] font-bold text-[#2D2B28]' : 'opacity-60'}`}
            onClick={() => setActiveTab('chat')}
          >
            Pantry Science AI
          </button>
        </div>

        {/* Top-Right Profile button instead of companion */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold transition shadow-xs cursor-pointer active:scale-95 border ${
            activeTab === 'profile'
              ? 'bg-[#8B735B] text-white border-[#8B735B]'
              : 'bg-[#2D2B28] hover:bg-[#8B735B] text-[#FAF9F6] border-[#2D2B28]'
          }`}
          title="View Baker Profile"
        >
          <User className="h-3.5 w-3.5 text-current shrink-0" />
          <span className="hidden xs:inline">Profile</span>
        </button>
      </header>

      {/* Main Responsive Hub Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col relative z-10 px-0 sm:px-6 py-0 sm:py-8 justify-start">
        {/* Editorial container box for premium feels on bigger screens */}
        <div className="flex-1 bg-[#FAF9F6] sm:bg-white sm:rounded-3xl sm:border sm:border-[#D4D1C9] sm:shadow-lg flex flex-col overflow-hidden relative min-h-[500px] sm:min-h-[700px] pb-20 sm:pb-6">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </main>

      {/* Floating persistent quick companion trigger link - Hide completely when in Chat or Profile */}
      {activeTab !== 'chat' && activeTab !== 'profile' && onOpenGlobalChat && (
        <button
          onClick={onOpenGlobalChat}
          id="global-chat-companion"
          className="block sm:hidden fixed bottom-20 right-4 p-3.5 bg-[#2D2B28] hover:bg-[#8B735B] text-white rounded-full shadow-lg border border-[#F2F0EB]/30 z-40 transition-transform active:scale-90 cursor-pointer"
          title="Ask Chef Crumb"
        >
          <Sparkles className="h-5 w-5 text-[#E8E4DA] animate-pulse" />
        </button>
      )}

      {/* Responsive Universal Bottom Navigation Bar (Sticking nicely for mobile bakes) */}
      <nav className="fixed sm:hidden bottom-0 inset-x-0 h-16 bg-white border-t border-[#D4D1C9] px-6 flex items-center justify-around z-30 shadow-md">
        <button
          onClick={() => setActiveTab('troubleshoot')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activeTab === 'troubleshoot' ? 'text-[#2D2B28] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold font-sans">Diagnose</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activeTab === 'history' ? 'text-[#2D2B28] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <ClipboardList className="h-4.5 w-4.5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold font-sans">History</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activeTab === 'chat' ? 'text-[#2D2B28] font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <MessageCircle className="h-4.5 w-4.5" />
          <span className="text-[9px] uppercase tracking-wider font-semibold font-sans">Chef AI</span>
        </button>
      </nav>

      {/* Professional Editorial Footer on Desktop only */}
      <footer className="hidden sm:block w-full border-t border-[#D4D1C9] py-8 px-6 bg-[#2D2B28] text-[#F2F0EB]">
        <div className="max-w-2xl mx-auto flex flex-col gap-4 sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest opacity-60 block font-semibold">Crumb Forensic Laboratories</span>
            <p className="text-[10px] text-stone-300 font-sans italic">Baking science helps turn tragic mistakes into delicious masterpieces.</p>
          </div>
          <div className="flex gap-4 items-center text-[9px] uppercase tracking-[0.12em] font-medium text-[#F2F0EB]/95">
            <span className="hover:text-white transition-colors cursor-pointer">Bread Logic</span>
            <span className="hover:text-white transition-colors cursor-pointer">Thermal Kinetics</span>
            <span className="hover:text-white transition-colors cursor-pointer">Hydration Tables</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
