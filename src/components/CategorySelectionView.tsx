import React from 'react';
import { CATEGORIES } from '../data/questions';
import { BakeCategory } from '../types';
import { ArrowLeft, Wheat, Cake, Cookie, Utensils, Smile } from 'lucide-react';

interface CategorySelectionViewProps {
  onSelectCategory: (category: BakeCategory) => void;
  onCancel: () => void;
}

// Map key indices to beautiful SVG luciders styled in Editorial charcoal/linen
const IconMap = (iconName: string) => {
  switch (iconName) {
    case 'Wheat':
      return <Wheat className="h-6 w-6 shrink-0 text-[#2D2B28] stroke-[1.5]" />;
    case 'Cake':
      return <Cake className="h-6 w-6 shrink-0 text-[#2D2B28] stroke-[1.5]" />;
    case 'Cookie':
      return <Cookie className="h-6 w-6 shrink-0 text-[#2D2B28] stroke-[1.5]" />;
    case 'Smile':
      return <Smile className="h-6 w-6 shrink-0 text-[#2D2B28] stroke-[1.5]" />;
    default:
      return <Utensils className="h-6 w-6 shrink-0 text-[#2D2B28] stroke-[1.5]" />;
  }
};

export function CategorySelectionView({ onSelectCategory, onCancel }: CategorySelectionViewProps) {
  // Read favorite categories from profile preferences
  const preferredFocuses: string[] = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('crumb_profile_bake_types');
      return saved ? JSON.parse(saved) : ['Bread', 'Cakes'];
    } catch {
      return ['Bread', 'Cakes'];
    }
  }, []);

  const isPreferred = (catId: string) => {
    // Map catId to matching focus names
    const mapping: Record<string, string> = {
      'bread': 'Bread',
      'cake': 'Cakes',
      'pastry': 'Pastry',
      'biscuits': 'Biscuits',
      'other': 'Other'
    };
    return preferredFocuses.includes(mapping[catId] || '');
  };

  return (
    <div className="flex-1 p-6 flex flex-col justify-between bg-[#FAF9F6] text-[#2D2B28]">
      {/* Header with Back button */}
      <div className="space-y-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-[#2D2B28]/70 hover:text-[#2D2B28] font-medium py-1 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="uppercase tracking-widest text-[9px] font-bold">Back</span>
        </button>

        <div>
          <span className="text-[10px] font-medium text-[#8B735B] uppercase tracking-widest font-sans italic">Stage 1: Classification</span>
          <h2 className="text-2xl font-serif font-normal text-[#2D2B28] tracking-tight mt-0.5">What did you bake?</h2>
          <p className="text-xs text-[#2D2B28]/70 mt-1 leading-relaxed font-sans">
            Pick a recipe category. We customize our chemical diagnostics questions to fit your specific starch structure.
          </p>
        </div>
      </div>

      {/* Grid of Choices - Large tap targets with clean bone-like cards */}
      <div className="my-6 grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-1">
        {CATEGORIES.map((cat) => {
          const pref = isPreferred(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full group text-left rounded-2xl p-4 border flex items-center gap-4 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
                pref 
                  ? 'border-[#8B735B]/75 bg-[#FAF6EE] shadow-2xs hover:border-[#8B735B]' 
                  : 'border-[#D4D1C9] bg-white hover:border-[#2D2B28]'
              }`}
            >
              <div className={`p-3 rounded-xl border transition-colors ${
                pref 
                  ? 'bg-amber-100/40 border-[#8B735B]/30 group-hover:bg-[#E8E4DA]' 
                  : 'bg-[#FAF9F6] border-[#D4D1C9]/60 group-hover:bg-[#E8E4DA]'
              }`}>
                {IconMap(cat.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#2D2B28] flex items-center justify-between">
                  <span>{cat.name}</span>
                  {pref && (
                    <span className="px-1.5 py-0.5 bg-[#8B735B]/10 text-[#8B735B] rounded text-[8px] uppercase tracking-widest font-extrabold font-sans">
                      ★ PREFERENCE
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-[#2D2B28]/85 mt-1 leading-relaxed font-sans">{cat.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Educational message */}
      <div className="bg-white rounded-xl p-3 text-center border border-[#D4D1C9] text-[10px] text-[#2D2B28]/70 leading-relaxed font-sans italic">
         Every flour behaves uniquely under thermal hydration. Let's calibrate your specific failure map.
      </div>
    </div>
  );
}
