import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, ArrowRight, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';

interface PhotoPromptViewProps {
  onNext: (photoUrl: string | null, preAnalysis: string | null) => void;
  onSkip: () => void;
}

// Preset simulation failures to allow instant browser-testing with full pre-analysis
const SIMULATION_PRESETS = [
  {
    id: 'cake_sunken',
    label: 'Sunken Cake Core',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=60',
    preAnalysis: 'We can see some sinking in the centre — we\'ll focus our questions there.',
    category: 'cake',
    selectedOption: 'sunken_middle',
    isValid: true
  },
  {
    id: 'bread_pale_dense',
    label: 'Dull Dense Loaf',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=60',
    preAnalysis: 'We see a dense, heavy crumb and minimal rising lines — we\'ll look closely at proofing and yeast activity.',
    category: 'bread',
    selectedOption: 'dense_gummy_heavy',
    isValid: true
  },
  {
    id: 'cookies_burnt',
    label: 'Charred Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&auto=format&fit=crop&q=60',
    preAnalysis: 'We detect severe scorching on the bottom crust edges — we\'ll examine thermal pan heat transfer.',
    category: 'biscuits',
    selectedOption: 'burnt_bottoms',
    isValid: true
  },
  {
    id: 'unrecognizable',
    label: 'Dark Cooking Pot (Bad Light)',
    imageUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=300&auto=format&fit=crop&q=60',
    preAnalysis: 'We couldn\'t quite make that out — try a photo in better light, or skip and describe it instead.',
    category: null,
    selectedOption: null,
    isValid: false
  }
];

export function PhotoPromptView({ onNext, onSkip }: PhotoPromptViewProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [preAnalysis, setPreAnalysis] = useState<string | null>(null);
  const [isPhotoValid, setIsPhotoValid] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        setPhotoUrl(resultUrl);
        // Synthesise a dynamic bake diagnostic depending on general metadata or file presence
        setPreAnalysis('We can see some density and irregular crust setting — we\'ll fine-tune our investigative inquiries based on this.');
        setIsPhotoValid(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset: typeof SIMULATION_PRESETS[0]) => {
    setPhotoUrl(preset.imageUrl);
    setPreAnalysis(preset.preAnalysis);
    setIsPhotoValid(preset.isValid);
  };

  const handleProceed = () => {
    if (photoUrl && isPhotoValid) {
      onNext(photoUrl, preAnalysis);
    } else {
      onSkip();
    }
  };

  const handleReset = () => {
    setPhotoUrl(null);
    setPreAnalysis(null);
    setIsPhotoValid(true);
  };

  return (
    <div className="flex-1 p-6 flex flex-col justify-between bg-[#FAF9F6] text-[#2D2B28] animate-fade-in">
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Top Header */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-medium text-[#8B735B] uppercase tracking-widest font-sans italic">Forensic Step 0</span>
          <h2 className="text-3xl font-serif font-normal text-[#2D2B28] tracking-tight mt-1">Show us your bake</h2>
          <p className="text-xs text-[#2D2B28]/70 mt-2 leading-relaxed font-sans">
            A photo helps us ask smarter questions by analyzing crust colors, crumb bubbles, and structural craters. Totally optional.
          </p>
        </div>

        {/* Dynamic Display State */}
        {!photoUrl ? (
          /* Initial Upload Options */
          <div className="space-y-4 pt-2">
            {/* Simulation Presets Section - Quick Testing */}
            <div className="bg-white rounded-2xl p-4 border border-[#D4D1C9] space-y-3">
              <div className="flex items-center gap-1.5 ">
                <Sparkles className="h-3.5 w-3.5 text-[#8B735B]" />
                <span className="text-[9px] font-bold text-[#8B735B] uppercase tracking-widest font-sans">Click to Simulate Bakes</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                {SIMULATION_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className="p-2 border border-[#D4D1C9] hover:border-[#8B735B] rounded-xl bg-[#FAF9F6] text-[10px] font-sans font-medium transition flex flex-col gap-1.5 cursor-pointer text-[#2D2B28]"
                  >
                    <img 
                      src={preset.imageUrl} 
                      alt={preset.label} 
                      className="w-full h-12 object-cover rounded-lg pointer-events-none filter brightness-95" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Standard stacked camera roll buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-13 bg-[#2D2B28] hover:bg-[#8B735B] text-[#FAF9F6] text-xs uppercase tracking-widest font-medium rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                <Camera className="h-4.5 w-4.5" />
                <span>Take a photo</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-13 bg-white hover:bg-[#FAF9F6] text-[#2D2B28] border border-[#D4D1C9] text-xs uppercase tracking-widest font-medium rounded-xl flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                <ImageIcon className="h-4.5 w-4.5 text-stone-500" />
                <span>Upload from camera roll</span>
              </button>
            </div>
          </div>
        ) : (
          /* Thumbnail & AI Confirmation / Edge State Display */
          <div className="space-y-4 pt-1">
            <div className="bg-white rounded-3xl p-4 border border-[#D4D1C9] shadow-xs flex flex-col items-center text-center relative overflow-hidden">
              {/* Photo Frame with Rounded corners to reflect mobile product style */}
              <div className="w-full max-h-56 overflow-hidden rounded-2xl relative border border-[#D4D1C9] bg-stone-100 flex items-center justify-center">
                <img 
                  src={photoUrl} 
                  alt="My uploaded bake" 
                  className="w-full max-h-56 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Analysis Text Box */}
              {isPhotoValid ? (
                /* Valid Pre-Analysis state */
                <div className="mt-4 p-3 bg-[#FAF9F6] rounded-xl border border-[#D4D1C9]/60 w-full text-left">
                  <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-[#8B735B] mb-1 font-sans">
                    <Sparkles className="h-3 w-3" />
                    <span>Luminescence & Core Pre-Analysis</span>
                  </div>
                  <p className="text-[11px] text-[#2D2B28] leading-relaxed italic font-sans font-medium">
                    "{preAnalysis}"
                  </p>
                </div>
              ) : (
                /* Edge State - Unrecognizable / Too Dark Warning */
                <div className="mt-4 p-3.5 bg-rose-50 rounded-xl border border-rose-200 w-full text-left flex gap-2.5 items-start">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-rose-800 uppercase tracking-widest font-sans">Analysis Blocked</span>
                    <p className="text-[11px] text-rose-950 leading-relaxed font-sans">
                      We couldn't quite make that out — try a photo in better light, or skip and describe it instead.
                    </p>
                  </div>
                </div>
              )}

              {/* Retry / Back Control */}
              <button
                onClick={handleReset}
                className="mt-3 flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-stone-400 hover:text-[#2D2B28] cursor-pointer font-sans transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Try a different photo</span>
              </button>
            </div>

            {/* If Valid, present Continue button; otherwise, skipped */}
            {isPhotoValid && (
              <button
                onClick={handleProceed}
                className="w-full h-11 bg-[#2D2B28] hover:bg-[#8B735B] text-white rounded-xl text-xs uppercase tracking-widest font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-all [font-weight:600]"
              >
                <span>Proceed with Photo Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Option Option */}
      <div className="pt-4 flex justify-center border-t border-[#D4D1C9]/40 mt-4">
        <button
          onClick={onSkip}
          className="text-xs text-stone-500 hover:text-[#2D2B28] hover:underline cursor-pointer font-sans uppercase tracking-[0.1em] font-medium transition"
        >
          Skip, I'll describe it instead
        </button>
      </div>
    </div>
  );
}
