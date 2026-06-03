import { Diagnosis, TroubleshootingSession } from '../types';
import { ArrowLeft, CheckCircle2, FlaskConical, MessageSquare, Sparkles, RefreshCw, Calendar, BookOpen } from 'lucide-react';
import { CATEGORIES } from '../data/questions';

interface DiagnosisViewProps {
  session: TroubleshootingSession;
  onBackToHome: () => void;
  onLaunchAIChat: () => void;
  onRestartTroubleshoot: () => void;
}

export function DiagnosisView({ session, onBackToHome, onLaunchAIChat, onRestartTroubleshoot }: DiagnosisViewProps) {
  const { diagnosis, category, answers, date } = session;

  const catInfo = CATEGORIES.find(c => c.id === category);

  const confidenceStyles = {
    High: 'bg-[#E8E4DA] text-[#2D2B28] border-[#D4D1C9]',
    Medium: 'bg-[#FAF9F6] text-[#8B735B] border-[#D4D1C9]',
    'We need more context': 'bg-stone-50 text-stone-500 border-[#D4D1C9]',
  }[diagnosis.confidence || 'Medium'];

  return (
    <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-[#FAF9F6] text-[#2D2B28]">
      {/* Top action links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs text-[#2D2B28]/70 hover:text-[#2D2B28] font-medium py-1 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="uppercase tracking-widest text-[9px] font-bold">Home</span>
          </button>

          <span className="text-[10px] text-stone-400 font-sans italic flex items-center gap-1 uppercase tracking-wider">
            <Calendar className="h-3 w-3" />
            {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-medium text-[#8B735B] uppercase tracking-widest font-sans italic">Stage 3: Diagnostic Report</span>
          <h2 className="text-2xl font-serif font-normal text-[#2D2B28] tracking-tight mt-0.5">We Found the Culprit</h2>
          <p className="text-xs text-[#2D2B28]/70 mt-1 font-sans">Here is our forensic analysis based on your symptoms.</p>
        </div>
      </div>

      {/* Diagnosis Report Card */}
      <div className="my-5 space-y-4 flex-1">
        
        {/* Main Title & Confidence */}
        <div className="bg-white rounded-2xl p-5 border border-[#D4D1C9] shadow-md space-y-3.5 relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-[#8B735B]" />
          
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest font-sans italic">
              {catInfo?.name} Case
            </span>
            <div className={`text-[10px] font-medium px-2.5 py-0.5 rounded uppercase tracking-wider border ${confidenceStyles}`}>
              {diagnosis.confidence} Confidence
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif font-medium text-[#2D2B28] leading-tight">
              {diagnosis.title}
            </h3>
            <p className="text-[10px] text-[#8B735B] font-sans italic mt-0.5 font-bold uppercase tracking-wider">
              ⚡ {diagnosis.probability} Matching Probability
            </p>
          </div>

          <p className="text-xs text-[#2D2B28]/80 leading-relaxed font-sans italic bg-[#FAF9F6] p-3 rounded-xl border border-[#D4D1C9]/50">
            "{diagnosis.summary}"
          </p>
        </div>

        {/* Actionable items: Next Steps (Sleek Charcoal Banner) */}
        <div className="bg-[#2D2B28] text-[#F2F0EB] rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-[#E8E4DA] shrink-0" />
            <h4 className="text-[10px] font-medium uppercase tracking-widest font-sans italic text-[#E8E4DA]">Your Forensic Action Steps</h4>
          </div>
          
          <ul className="grid grid-cols-1 gap-2.5 pl-1 text-[11px] font-sans">
            {diagnosis.actionSteps.map((step, idx) => (
              <li key={idx} className="flex gap-2.5 items-start leading-relaxed">
                <span className="bg-[#FAF9F6]/15 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[9px] border border-white/15 shrink-0 mt-0.5 text-[#FAF9F6]">
                  {idx + 1}
                </span>
                <span className="text-[#F2F0EB]/90">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Science Breakdown - Educational intermediate */}
        <div className="bg-white rounded-2xl p-5 border border-[#D4D1C9] space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4.5 w-4.5 text-[#8B735B] stroke-[1.5]" />
            <h4 className="text-[10px] font-medium text-[#8B735B] uppercase tracking-widest font-sans italic">The Molecular Science</h4>
          </div>
          <p className="text-xs text-[#2D2B28]/80 leading-relaxed font-sans">
            {diagnosis.scienceExplanation}
          </p>

          <div className="border-t border-[#D4D1C9]/50 pt-2.5 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-[#8B735B]/70" />
            <span className="text-[10px] text-stone-500 font-sans italic">"{diagnosis.educationalSnippet}"</span>
          </div>
        </div>
      </div>

      {/* "Dig Deeper with AI" prompt and troubleshooting restart controls */}
      <div className="space-y-3">
        <button
          onClick={onLaunchAIChat}
          id="btn-ai-companion"
          className="w-full bg-[#2D2B28] hover:bg-[#8B735B] text-white rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
        >
          <div className="flex items-start gap-3 text-left">
            <div className="p-2 bg-white/10 rounded-xl group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-[#E8E4DA] animate-pulse" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest leading-none text-[#F2F0EB] font-sans">Query Chef Crumb AI</h4>
              <p className="text-[9px] text-[#E8E4DA]/80 mt-1 font-sans italic">Let's solve baking chemistry, formulas & ratios.</p>
            </div>
          </div>
          <MessageSquare className="h-5 w-5 text-[#E8E4DA] group-hover:scale-110 transition-transform shrink-0" />
        </button>

        <button
          onClick={onRestartTroubleshoot}
          className="w-full h-11 bg-transparent hover:bg-[#FAF9F6]/50 text-stone-500 hover:text-stone-700 text-[10px] uppercase tracking-widest font-medium font-sans italic rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>New Calibration Session</span>
        </button>
      </div>
    </div>
  );
}
