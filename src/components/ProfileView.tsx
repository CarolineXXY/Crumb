import React, { useState, useEffect } from 'react';
import { TroubleshootingSession, BakeCategory } from '../types';
import { 
  Award, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Check, 
  ChevronDown, 
  Sparkle, 
  Activity, 
  Volume2, 
  BellRing, 
  Layers, 
  Info,
  Cookie,
  User,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Camera
} from 'lucide-react';

interface ProfileViewProps {
  history: TroubleshootingSession[];
  onBackToHome: () => void;
}

// Preset warm culinary avatars that user can cycle through or select
const AVATAR_PRESETS = [
  "🍞", // Classic bread
  "🧁", // Cupcake
  "👩‍🍳", // Baker chef
  "🥯", // Bagel
  "🥐", // Croissant
  "🍪", // Cookie
  "🍯", // Honey
  "🌾"  // Wheat
];

export function ProfileView({ history, onBackToHome }: ProfileViewProps) {
  // --- STATE FOR PERSONALIZATIONS ---
  const [avatarIndex, setAvatarIndex] = useState(() => {
    const saved = localStorage.getItem('crumb_profile_avatar_index');
    return saved ? parseInt(saved, 10) : 2; // Default to 👩‍🍳
  });

  const [bakerLevel, setBakerLevel] = useState<'Beginner' | 'Home Baker' | 'Intermediate' | 'Enthusiast'>(() => {
    return (localStorage.getItem('crumb_profile_baker_level') as any) || 'Intermediate';
  });

  const [ovenType, setOvenType] = useState<'Conventional' | 'Fan (Convection)' | 'Gas' | 'Unknown'>(() => {
    return (localStorage.getItem('crumb_profile_oven_type') as any) || 'Fan (Convection)';
  });

  const [altitude, setAltitude] = useState<'Sea level' | 'Moderate (300–1500m)' | 'High (1500m+)'>(() => {
    return (localStorage.getItem('crumb_profile_altitude') as any) || 'Sea level';
  });

  // Bake types the user bakes most (Multi-select)
  const [selectedBakeTypes, setSelectedBakeTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem('crumb_profile_bake_types');
    return saved ? JSON.parse(saved) : ['Bread', 'Cakes'];
  });

  // Notification toggle
  const [allowNotifications, setAllowNotifications] = useState(() => {
    return localStorage.getItem('crumb_profile_notifications') !== 'false';
  });

  // UI state for bottom sheet & feedback
  const [isLevelSheetOpen, setIsLevelSheetOpen] = useState(false);
  const [isSavedIcon, setIsSavedIcon] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Save changes automatically or with a subtle badge toast
  const triggerSaveNotification = (msg: string) => {
    setSuccessMessage(msg);
    setIsSavedIcon(true);
    setTimeout(() => {
      setIsSavedIcon(false);
      setSuccessMessage('');
    }, 2000);
  };

  useEffect(() => {
    localStorage.setItem('crumb_profile_avatar_index', String(avatarIndex));
  }, [avatarIndex]);

  useEffect(() => {
    localStorage.setItem('crumb_profile_baker_level', bakerLevel);
  }, [bakerLevel]);

  useEffect(() => {
    localStorage.setItem('crumb_profile_oven_type', ovenType);
  }, [ovenType]);

  useEffect(() => {
    localStorage.setItem('crumb_profile_altitude', altitude);
  }, [altitude]);

  useEffect(() => {
    localStorage.setItem('crumb_profile_bake_types', JSON.stringify(selectedBakeTypes));
  }, [selectedBakeTypes]);

  useEffect(() => {
    localStorage.setItem('crumb_profile_notifications', String(allowNotifications));
  }, [allowNotifications]);

  // --- STATS COMPUTATION FOR BAKING SNAPSHOT ---
  const totalSessions = history.length;

  // 1. Find most baked category
  let mostBakedCategory = 'None yet';
  if (totalSessions > 0) {
    const categoryCounts: Record<string, number> = {};
    history.forEach(s => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });
    const sorted = Object.entries(categoryCounts).sort((a,b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const bestCat = sorted[0][0];
      // Map back tidy label
      mostBakedCategory = bestCat.charAt(0).toUpperCase() + bestCat.slice(1);
    }
  }

  // 2. Find recurring diagnosed issue or nemesis title
  let recurringNemesis = 'None yet';
  if (totalSessions > 0) {
    const diagnosisCounts: Record<string, number> = {};
    history.forEach(s => {
      if (s.diagnosis && s.diagnosis.title) {
        diagnosisCounts[s.diagnosis.title] = (diagnosisCounts[s.diagnosis.title] || 0) + 1;
      }
    });
    const sorted = Object.entries(diagnosisCounts).sort((a,b) => b[1] - a[1]);
    if (sorted.length > 0) {
      // Return short clean title
      recurringNemesis = sorted[0][0].split('(')[0].trim();
    }
  }

  // --- PATTERN DETECTOR FOR RECURRING ISSUES ---
  const extractPatterns = () => {
    if (totalSessions < 2) return [];

    const patternsList: { text: string; linkText: string }[] = [];
    
    // Group diagnoses
    const diagnosisGroup: Record<string, { count: number; category: string }> = {};
    history.forEach(s => {
      const dTitle = s.diagnosis?.title?.split('(')[0].trim() || 'Issue';
      if (!diagnosisGroup[dTitle]) {
        diagnosisGroup[dTitle] = { count: 0, category: s.category };
      }
      diagnosisGroup[dTitle].count += 1;
    });

    const repeatIssues = Object.entries(diagnosisGroup)
      .filter(([_, info]) => info.count >= 2)
      .sort((a,b) => b[1].count - a[1].count);

    if (repeatIssues.length > 0) {
      repeatIssues.forEach(([issueTitle, info]) => {
        const percent = Math.round((info.count / history.filter(s => s.category === info.category).length) * 100);
        patternsList.push({
          text: `${info.count} of your ${info.category} investigation logs pointed to "${issueTitle}" as the culinary cause.`,
          linkText: "Review sessions"
        });
      });
    }

    // High moisture ratio check / yeast scalding
    const yeastScaldingCount = history.filter(s => s.diagnosis?.id === 'bread_dead_yeast').length;
    if (yeastScaldingCount >= 1) {
      patternsList.push({
        text: `Thermometer audit: Rapid liquid contact has interrupted micro-yeast cells before rising.`,
        linkText: "Calibrate water"
      });
    }

    // Add general fallback advice pattern based on user's category count
    if (patternsList.length === 0 && totalSessions >= 3) {
      patternsList.push({
        text: `Consistent fermentation has been noted across your bakes. Defect dispersion appears quite low.`,
        linkText: "Explore active science"
      });
    }

    return patternsList.slice(0, 3);
  };

  const detectedPatterns = extractPatterns();

  // Handle Level Selection
  const handleSelectLevel = (level: 'Beginner' | 'Home Baker' | 'Intermediate' | 'Enthusiast') => {
    setBakerLevel(level);
    setIsLevelSheetOpen(false);
    triggerSaveNotification(`Upgraded to ${level}!`);
  };

  // Toggle multi-select bake preferences
  const handleToggleBakeType = (type: string) => {
    let updated;
    if (selectedBakeTypes.includes(type)) {
      updated = selectedBakeTypes.filter(t => t !== type);
    } else {
      updated = [...selectedBakeTypes, type];
    }
    setSelectedBakeTypes(updated);
    triggerSaveNotification("Updated baking interests!");
  };

  // Switch to next avatar
  const cycleAvatar = () => {
    const nextIndex = (avatarIndex + 1) % AVATAR_PRESETS.length;
    setAvatarIndex(nextIndex);
    triggerSaveNotification("Changed avatar icon");
  };

  return (
    <div className="flex-1 p-5 sm:p-7 bg-[#FCFAF7] text-[#2D2B28] flex flex-col justify-start overflow-y-auto animate-fade-in relative">
      
      {/* Toast Save Indicator */}
      {isSavedIcon && (
        <div className="fixed top-20 right-4 bg-[#8B735B] text-[#FAF9F6] text-[10px] px-3.5 py-2 rounded-full font-semibold uppercase tracking-wider shadow-md flex items-center gap-2 z-50 animate-bounce">
          <Check className="h-3 w-3 text-emerald-300" />
          <span>{successMessage || "Changes saved"}</span>
        </div>
      )}

      {/* Cookbook Top Section - Cover Page style */}
      <div className="text-center pt-4 pb-8 border-b border-[#E3DEC3]/60 relative">
        <div className="absolute top-0 right-0 text-stone-300 pointer-events-none">
          <Sparkle className="h-4 w-4 text-[#8B735B]/30 animate-pulse" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B735B] font-semibold italic">Inside Cover of Your Kitchen Diary</p>
        <span className="text-[9px] uppercase tracking-widest text-[#2D2B28]/40 font-mono block mt-0.5">EST. JUNE 2026</span>
      </div>

      {/* IDENTITY: Warm Profile Block */}
      <div className="py-7 flex flex-col items-center text-center">
        {/* Avatar Area with cycle tap */}
        <div className="relative group">
          <button 
            onClick={cycleAvatar}
            className="h-20 w-20 rounded-full bg-[#FAF6EE] border-2 border-[#D4D1C9] hover:border-[#8B735B] shadow-sm flex items-center justify-center text-3xl font-serif relative shrink-0 transition-all duration-300 cursor-pointer active:scale-95 group-hover:rotate-6 bg-radial"
          >
            {AVATAR_PRESETS[avatarIndex]}
            <div className="absolute bottom-0 right-0 bg-[#8B735B] p-1.5 rounded-full text-white border-2 border-[#FCFAF7] transition shadow-xs group-hover:scale-110">
              <Camera className="h-2.5 w-2.5" />
            </div>
          </button>
          <span className="text-[8px] uppercase tracking-wider text-stone-400 block mt-1 pointer-events-none">Tap to change icon</span>
        </div>

        {/* User Name in Playfair Display (editorial serif) */}
        <h2 className="text-3xl font-serif font-extrabold text-[#2D2B28] mt-3 tracking-tight font-serif italic">
          Caroline Xu
        </h2>

        {/* Selected level tag */}
        <button
          onClick={() => setIsLevelSheetOpen(true)}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B735B]/15 hover:bg-[#8B735B]/25 text-[#8B735B] rounded-full text-[10px] uppercase tracking-widest font-extrabold transition-all duration-150 cursor-pointer border border-[#8B735B]/25 self-center"
        >
          <span>{bakerLevel}</span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
        </button>
      </div>

      <div className="h-[1px] bg-[#E3DEC3]/40 w-full" />

      {/* BAKING SNAPSHOT */}
      <div className="py-6 space-y-4">
        <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B735B] font-sans">
          Your Baking Snapshot
        </h3>

        {totalSessions === 0 ? (
          <div className="p-5 text-center bg-[#FAF6EE]/70 rounded-2xl border border-[#E3DEC3]/50 italic font-sans text-xs text-stone-500 leading-relaxed shadow-3xs">
            "Your digital cookbook is empty. Start a troubleshooting investigation to see your baking forensic statistics!"
          </div>
        ) : (
          <div className="bg-[#FAF6EE] rounded-2xl border border-[#D4CFC1] p-5 shadow-xs space-y-4">
            
            {/* Total audits session count */}
            <div className="flex justify-between items-center py-1.5 border-b border-[#E3DEC3]/60">
              <span className="text-xs text-[#2D2B28]/80 font-sans">Total forensic audits</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-serif font-bold text-[#2D2B28]">{totalSessions}</span>
                <span className="text-[9px] text-[#2D2B28]/60 font-sans">sessions</span>
              </div>
            </div>

            {/* Most baked category */}
            <div className="flex justify-between items-center py-1.5 border-b border-[#E3DEC3]/60">
              <span className="text-xs text-[#2D2B28]/80 font-sans">Your most baked</span>
              <span className="text-xs font-serif italic font-bold text-[#8B735B]">
                {mostBakedCategory}
              </span>
            </div>

            {/* Most diagnostic issue */}
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-[#2D2B28]/80 font-sans">Your recurring nemesis</span>
              <span className="text-xs font-serif italic font-bold text-stone-700 max-w-[200px] truncate block text-right" title={recurringNemesis}>
                {recurringNemesis}
              </span>
            </div>
            
          </div>
        )}
      </div>

      <div className="h-[1px] bg-[#E3DEC3]/40 w-full" />

      {/* RECURRING ISSUES PANEL (Spotting patterns across sessions) */}
      <div className="py-6 space-y-4">
        <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B735B] font-sans">
          Identified Baking Patterns
        </h3>

        {detectedPatterns.length === 0 ? (
          <div className="p-5 text-center bg-[#FAF6EE]/40 rounded-2xl border border-[#E1DCCB]/40 italic font-sans text-stone-400 text-xs shadow-2xs">
            Bake a little more and we'll start spotting patterns.
          </div>
        ) : (
          <div className="space-y-3.5 pr-1">
            {detectedPatterns.map((pat, index) => (
              <div 
                key={index} 
                className="bg-white border border-[#D4D1C9] rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden shadow-2xs animate-fade-in"
              >
                <p className="text-[11.5px] text-[#2D2B28]/90 font-serif leading-relaxed italic pl-3 border-l-2 border-[#8B735B]">
                  "{pat.text}"
                </p>
                <div className="mt-2.5 flex justify-end">
                  <button 
                    onClick={onBackToHome}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#8B735B] hover:text-[#2D2B28] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{pat.linkText}</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-[1px] bg-[#E3DEC3]/40 w-full" />

      {/* KITCHEN CONTEXT */}
      <div className="py-6 space-y-4">
        <div className="flex flex-col">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#2D2B28] font-sans">
            Your Kitchen
          </h3>
          <span className="text-[10px] text-stone-500 italic mt-0.5 font-sans leading-relaxed">
            Helps us give you more accurate diagnoses every session.
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#D4D1C9] p-4.5 space-y-4.5 shadow-2xs">
          {/* Oven Type selection with stylish inline button selectors */}
          <div className="space-y-1.5">
            <span className="text-[10.5px] uppercase tracking-wider font-bold text-[#2D2B28] flex items-center gap-1 font-sans">
              Oven heating model
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(['Conventional', 'Fan (Convection)', 'Gas', 'Unknown'] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => {
                    setOvenType(o);
                    triggerSaveNotification("Oven calibrated!");
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-sans border transition-all text-center cursor-pointer ${
                    ovenType === o
                      ? 'bg-[#2D2B28] text-[#FAF9F6] border-[#2D2B28] font-semibold'
                      : 'bg-[#FAF9F6] border-[#D4D1C9] text-stone-600 hover:bg-[#E8E4DA]/50'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-[#FAF9F6] w-full" />

          {/* Altitude Selector */}
          <div className="space-y-1.5">
            <span className="text-[10.5px] uppercase tracking-wider font-bold text-[#2D2B28] flex items-center gap-1 font-sans">
              Altitude range
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['Sea level', 'Moderate (300–1500m)', 'High (1500m+)'] as const).map((altVal) => (
                <button
                  key={altVal}
                  onClick={() => {
                    setAltitude(altVal);
                    triggerSaveNotification("Altitude index established!");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-sans border transition-all text-center cursor-pointer ${
                    altitude === altVal
                      ? 'bg-[#8B735B] text-white border-[#8B735B] font-semibold'
                      : 'bg-[#FAF9F6] border-[#D4D1C9] text-stone-600 hover:bg-[#E8E4DA]/50'
                  }`}
                >
                  {altVal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#E3DEC3]/40 w-full" />

      {/* BAKE PREFERENCES */}
      <div className="py-6 space-y-4">
        <div className="flex flex-col">
          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#2D2B28] font-sans">
            Your Baking Focuses
          </h3>
          <span className="text-[10px] text-stone-500 italic mt-0.5 font-sans leading-relaxed">
            Your culinary preferences appear highlighted in our diagnosis logs.
          </span>
        </div>

        {/* Selected multi-select list */}
        <div className="flex flex-wrap gap-2 pt-1">
          {['Bread', 'Cakes', 'Pastry', 'Biscuits', 'Other'].map((type) => {
            const isSelected = selectedBakeTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => handleToggleBakeType(type)}
                className={`px-4 py-2 rounded-full border text-xs font-sans uppercase tracking-widest font-extrabold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B735B] border-[#8B735B] text-white shadow-xs'
                    : 'bg-[#FAF9F6] border-[#D4D1C9] text-[#2D2B28]/70 hover:border-[#2D2B28]'
                }`}
              >
                {isSelected ? `★ ${type}` : type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#E3DEC3]/40 w-full" />

      {/* NOTIFICATION PREFERENCES */}
      <div className="py-6 space-y-3">
        <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B735B] font-sans">
          Baking Reminders
        </h3>
        
        <div className="flex items-start justify-between bg-white rounded-2xl border border-[#D4D1C9] p-4 shadow-3xs">
          <div className="flex-1 min-w-0 pr-4">
            <span className="text-xs font-bold text-[#2D2B28] block font-sans">Baking tips & reminders</span>
            <p className="text-[10px] text-stone-500 font-sans mt-0.5 leading-snug">
              Receive gentle alerts when it's time to fold, score, or feed your starter.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => {
              const nextVal = !allowNotifications;
              setAllowNotifications(nextVal);
              triggerSaveNotification(nextVal ? "Tips alert enabled!" : "Alerts muted");
            }}
            className={`w-11 h-6 rounded-full p-1 transition-all duration-300 relative outline-none cursor-pointer self-center ${
              allowNotifications ? 'bg-[#8B735B]' : 'bg-stone-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${
              allowNotifications ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Educational metadata footer */}
      <div className="text-center pt-8 pb-12 opacity-45 text-[9px] uppercase tracking-widest border-t border-[#E3DEC3]/40">
        Crumb Forensic Lab · Senior Inspector Registry
      </div>


      {/* --- LEVEL SELECTION BOTTOM SHEET --- */}
      {isLevelSheetOpen && (
        <div className="absolute inset-0 bg-[#000000]/40 backdrop-blur-xs flex flex-col justify-end z-50 animate-fade-in">
          {/* Dismiss trigger backdrop */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsLevelSheetOpen(false)} />
          
          <div className="bg-[#FCFAF7] border-t-2 border-[#D4D1C9] rounded-t-3xl p-5 relative z-10 shadow-huge max-h-[85%] overflow-y-auto flex flex-col justify-between animate-slide-up">
            <div>
              <div className="w-12 h-1 bg-[#D4D1C9] rounded-full mx-auto mb-4" />
              
              <div className="text-center border-b border-[#E3DEC3]/50 pb-3 mb-4">
                <h4 className="text-sm uppercase tracking-widest font-extrabold text-[#2D2B28] font-sans">Calibrate Your Experience Level</h4>
                <p className="text-[11px] text-stone-500 mt-1 italic font-sans">Choose level honestly for tailored feedback instructions.</p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'Beginner',
                    desc: "Still learning the roles of yeast and hydration; mostly packet mixes or straightforward recipes."
                  },
                  {
                    id: 'Home Baker',
                    desc: "Bakes regularly, understands primary steps like proofing, handles simple gluten development."
                  },
                  {
                    id: 'Intermediate',
                    desc: "Keeps a starter alive, scores dough intentionally, comfortable with high hydrations."
                  },
                  {
                    id: 'Enthusiast',
                    desc: "Understands oven thermodynamics, flour ash content, and experiments with fermentation kinetics."
                  }
                ].map((choice) => {
                  const isCurrent = bakerLevel === choice.id;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleSelectLevel(choice.id as any)}
                      className={`w-full text-left rounded-xl p-3 px-4 border flex items-start gap-3 transition-colors ${
                        isCurrent 
                          ? 'border-[#8B735B] bg-[#8B735B]/5 text-[#2D2B28]' 
                          : 'border-[#D4D1C9] bg-white text-stone-700 hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className={`h-4.5 w-4.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                        isCurrent ? 'border-[#8B735B] bg-[#8B735B]' : 'border-[#D4D1C9]'
                      }`}>
                        {isCurrent && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider block text-[#2D2B28]">
                          {choice.id}
                        </span>
                        <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed font-sans">{choice.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setIsLevelSheetOpen(false)}
              className="mt-6 w-full py-2.5 bg-[#2D2B28] hover:bg-[#8B735B] text-white text-[10px] uppercase tracking-wider font-semibold rounded-xl text-center cursor-pointer transition active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
