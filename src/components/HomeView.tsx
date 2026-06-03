import { ArrowRight, History, Sparkles, AlertCircle, HelpCircle, Flame } from 'lucide-react';
import { TroubleshootingSession } from '../types';
import { CATEGORIES } from '../data/questions';

interface HomeViewProps {
  onStartNewTrouble: () => void;
  history: TroubleshootingSession[];
  onSelectSession: (session: TroubleshootingSession) => void;
  onOpenQuickChat: () => void;
}

export function HomeView({ onStartNewTrouble, history, onSelectSession, onOpenQuickChat }: HomeViewProps) {
  const latestSessions = history.slice(-2).reverse();

  // Daily baking science trivia tips (Editorial scientific tone)
  const chefTip = {
    title: "Starch Retrogradation & Stickiness",
    desc: "Got a gummy crumb? Adding flour prematurely backfires. Starch molecules hold onto water during mixing; try letting the mixture rest for 15 minutes. High proteins naturally hydrate and organize themselves without raw flour overload.",
    author: "Chef Crumb"
  };

  return (
    <div className="flex-1 p-6 flex flex-col justify-between bg-[#FAF9F6] text-[#2D2B28]">
      {/* Welcome Top Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#E8E4DA] flex items-center justify-center border border-[#D4D1C9]">
            <span className="text-xl">🥖</span>
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#8B735B] uppercase tracking-widest font-sans italic">Forensic Kitchen Lab</p>
            <h2 className="text-2xl font-serif font-normal tracking-tight text-[#2D2B28]">Welcome, Baker</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#D4D1C9] shadow-xs">
          <p className="text-[#2D2B28] text-xs leading-relaxed italic font-sans text-[#2D2B28]/80">
            "We analyze each culinary anomaly. Did a crust collapse prematurely or yeast lose its strength? Every failed bake is a case file solved."
          </p>
          <p className="text-[#8B735B] text-[10px] font-sans italic mt-2 uppercase tracking-widest">— Chef Crumb, Scientist</p>
        </div>
      </div>

      {/* Center CTA Button - Editorial High-Contrast Design */}
      <div className="my-6">
        <button
          onClick={onStartNewTrouble}
          id="btn-diagnose-bake"
          className="w-full bg-[#2D2B28] hover:bg-[#8B735B] text-white rounded-3xl p-6 shadow-xl flex flex-col items-start justify-between text-left group transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <div className="w-full flex justify-between items-center mb-3">
            <div className="bg-white/10 p-2.5 rounded-xl group-hover:bg-white/20 transition-colors">
              <Flame className="h-5 w-5 text-[#E8E4DA]" />
            </div>
            <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </div>
          <div>
            <h3 className="text-lg uppercase tracking-widest font-serif font-medium">Start Diagnosis</h3>
            <p className="text-[10px] text-white/70 mt-0.5 font-sans uppercase tracking-wider font-semibold">Forensic Baking & Science Investigation</p>
          </div>
        </button>
      </div>

      {/* Lower educational / helper section */}
      <div className="space-y-5">
        {/* Dynamic Tip representing the "Instruct / Teach as we go" value */}
        <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#D4D1C9] shadow-xs relative overflow-hidden">
          {/* Sourdough-like aesthetic background indicator */}
          <div className="absolute right-0 top-0 w-8 h-8 bg-[#8B735B]/10 rounded-bl-full flex items-center justify-center text-[10px]" />
          
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#8B735B] stroke-[1.5]" />
            <h4 className="text-[9px] font-bold text-[#8B735B] uppercase tracking-widest font-sans italic">Molecular Chemistry</h4>
          </div>
          <h5 className="text-base font-serif font-normal text-[#2D2B28] mb-1">{chefTip.title}</h5>
          <p className="text-[11px] text-[#2D2B28]/80 leading-relaxed font-sans">{chefTip.desc}</p>
        </div>

        {/* History Quick-Access or Empty State */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-sans italic">Recent Audits</h4>
            {history.length > 0 && (
              <span className="text-[9px] text-[#8B735B] font-bold uppercase tracking-wider font-sans italic">Journal Logs</span>
            )}
          </div>

          {latestSessions.length === 0 ? (
            <div className="bg-white/50 rounded-2xl p-4 text-center border border-dashed border-[#D4D1C9]">
              <p className="text-stone-500 text-[10px] uppercase font-sans tracking-wider py-2 italic">No logs saved in baking dossier.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {latestSessions.map((session) => {
                const catInfo = CATEGORIES.find(c => c.id === session.category);
                return (
                  <button
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    className="w-full bg-white hover:bg-[#FAF9F6] rounded-xl p-3 border border-[#D4D1C9] flex items-center justify-between transition-all shadow-xs hover:border-[#2D2B28] text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg">
                        {session.category === 'bread' ? '🍞' :
                         session.category === 'cake' ? '🍰' :
                         session.category === 'pastry' ? '🥐' :
                         session.category === 'biscuits' ? '🍪' : '🧁'}
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-[#2D2B28] truncate max-w-[190px] font-serif">{session.diagnosis.title}</h4>
                        <p className="text-[9px] text-[#2D2B28]/60 font-sans mt-0.5 uppercase tracking-wider italic">
                          {catInfo?.name} • {new Date(session.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#FAF9F6] text-[#2D2B28] text-[9px] font-bold px-2 py-1 rounded border border-[#D4D1C9] font-sans shrink-0 uppercase tracking-widest italic">
                      Inspect
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
