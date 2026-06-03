import { TroubleshootingSession } from '../types';
import { CATEGORIES } from '../data/questions';
import { Trash2, Calendar, ClipboardList, BookOpen, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HistoryViewProps {
  history: TroubleshootingSession[];
  onSelectSession: (session: TroubleshootingSession) => void;
  onClearHistory: () => void;
}

export function HistoryView({ history, onSelectSession, onClearHistory }: HistoryViewProps) {
  const sortedSessions = [...history].reverse(); // newest first

  return (
    <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-[#FAF9F6] text-[#2D2B28]">
      {/* Upper header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-medium text-[#8B735B] uppercase tracking-widest font-sans italic">Archive Logs</span>
            <h2 className="text-2xl font-serif font-normal text-[#2D2B28] tracking-tight mt-0.5">My Diagnostic Journal</h2>
            <p className="text-xs text-[#2D2B28]/70 mt-1 leading-relaxed font-sans">Here reside the results, science insights, and roadmap guides from your past sessions.</p>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 text-stone-400 hover:text-rose-650 transition duration-150 rounded-lg hover:bg-rose-50 cursor-pointer"
              title="Clear all logs"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sessions list */}
      <div className="my-5 flex-1 space-y-3 overflow-y-auto pr-1">
        {sortedSessions.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-dashed border-[#D4D1C9] text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-[#FAF9F6] flex items-center justify-center border border-[#D4D1C9]">
              <ClipboardList className="h-6 w-6 text-[#2D2B28] stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-[#2D2B28] uppercase tracking-wide font-sans italic">Journal is Empty</h3>
              <p className="text-[11px] text-[#2D2B28]/70 mt-1 max-w-[200px] leading-relaxed mx-auto font-sans">
                No past troubleshooting audits recorded yet. Run a diagnostics wizard to save your first bake report!
              </p>
            </div>
          </div>
        ) : (
          /* List content */
          <div className="grid grid-cols-1 gap-3">
            {sortedSessions.map((session) => {
              const catInfo = CATEGORIES.find(c => c.id === session.category);
              const { diagnosis } = session;

              return (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className="w-full text-left bg-white hover:bg-[#FAF9F6] rounded-2xl p-4 border border-[#D4D1C9] shadow-xs hover:border-[#2D2B28] transition relative overflow-hidden group hover:scale-[1.005] cursor-pointer"
                >
                  {/* Subtle vertical bar of category theme color */}
                  <div className="absolute left-0 inset-y-0 w-1.5 bg-[#8B735B]" />

                  <div className="space-y-3 pl-1.5">
                    {/* Category Label & Month-Day Date Info */}
                    <div className="flex items-center justify-between text-[10px] font-sans italic text-stone-400">
                      <span className="font-medium text-[#8B735B] uppercase tracking-wider">
                        {catInfo?.name}
                      </span>
                      <span className="flex items-center gap-1 uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Diagnosis details */}
                    <div>
                      <h4 className="text-xs font-serif font-medium text-[#2D2B28] group-hover:text-[#8B735B] leading-tight">
                        {diagnosis.title}
                      </h4>
                      <p className="text-[11px] text-[#2D2B28]/70 mt-1 truncate leading-relaxed font-sans">
                        "{diagnosis.summary}"
                      </p>
                    </div>

                    {/* Metadata Indicators: Checks, Confidence */}
                    <div className="pt-2 border-t border-[#D4D1C9]/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#8B735B] stroke-[1.5]" />
                        <span className="text-[9.5px] font-medium text-stone-600 font-sans">
                          {diagnosis.confidence} Confidence
                        </span>
                      </div>
                      
                      <span className="text-[10px] font-medium text-[#2D2B28] uppercase tracking-wider font-sans italic">
                        Inspect Report ➔
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Proactive Tip */}
      <div className="bg-white rounded-xl p-3 text-center border border-[#D4D1C9] text-[10px] text-[#2D2B28]/70 leading-relaxed font-sans italic">
         Failed bakes are just nutritious entries in your personal scientific research. Science is delicious!
      </div>
    </div>
  );
}
