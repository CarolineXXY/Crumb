import { useState } from 'react';
import { BakeCategory, Question, QuestionOption } from '../types';
import { QUESTIONS } from '../data/questions';
import { ArrowLeft, HelpCircle, Lightbulb, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';

interface SymptomFlowViewProps {
  category: BakeCategory;
  onCancel: () => void;
  onComplete: (answers: Record<string, { questionText: string; answerLabel: string; value: string }>) => void;
  onOpenQuickChat: (currentQuestionContext?: string) => void;
}

export function SymptomFlowView({ category, onCancel, onComplete, onOpenQuickChat }: SymptomFlowViewProps) {
  // Questions of chosen category
  const categoryQuestions = QUESTIONS[category] || [];
  const initialQuestion = categoryQuestions[0];

  // We track the branching path of question IDs as an array
  const [path, setPath] = useState<string[]>([initialQuestion.id]);
  const [answers, setAnswers] = useState<Record<string, { questionText: string; answerLabel: string; value: string }>>({});
  const [showingTip, setShowingTip] = useState(true);

  const currentQuestionId = path[path.length - 1];
  const currentQuestion = categoryQuestions.find(q => q.id === currentQuestionId);

  if (!currentQuestion) {
    return (
      <div className="flex-1 p-6 text-center flex flex-col justify-center bg-[#FAF9F6] text-[#2D2B28]">
        <p className="text-stone-500 font-serif">A slight error has arisen in the grain pathways. Please restart.</p>
        <button onClick={onCancel} className="mt-4 px-4 py-2 bg-[#2D2B28] text-[#F2F0EB] text-xs uppercase tracking-widest font-bold rounded-xl cursor-pointer">
          Return Home
        </button>
      </div>
    );
  }

  const handleOptionSelect = (option: QuestionOption) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionText: currentQuestion.text,
        answerLabel: option.label,
        value: option.value,
      },
    };
    setAnswers(updatedAnswers);

    // Look up branching map
    const nextQuestionId = currentQuestion.nextQuestionIdMap?.[option.value];

    if (nextQuestionId && categoryQuestions.some(q => q.id === nextQuestionId)) {
      // Proceed down the path
      setPath([...path, nextQuestionId]);
    } else {
      // Reached leaf node: complete troubleshooting diagnostic session!
      onComplete(updatedAnswers);
    }
  };

  const handleBack = () => {
    if (path.length <= 1) {
      onCancel();
    } else {
      const newPath = [...path];
      const poppedId = newPath.pop();
      setPath(newPath);
      
      // Clean up answer state for the popped question Id
      if (poppedId) {
        const newAnswers = { ...answers };
        delete newAnswers[poppedId];
        setAnswers(newAnswers);
      }
    }
  };

  // Estimate a realistic progress ratio based on the current step out of general maximum depth (max 6-8)
  const maxEstimatedSteps = 6;
  const progressPercent = Math.min(Math.round((path.length / maxEstimatedSteps) * 100), 100);

  return (
    <div className="flex-1 p-6 flex flex-col justify-between bg-[#FAF9F6] text-[#2D2B28]">
      {/* Top Navigation & Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-[#2D2B28]/70 hover:text-[#2D2B28] font-medium py-1 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="uppercase tracking-widest text-[9px] font-bold">{path.length === 1 ? 'Category' : 'Back'}</span>
          </button>

          <span className="text-[9px] font-bold text-[#8B735B] uppercase tracking-widest font-mono">
            Symptom 0{path.length}/08
          </span>
        </div>

        {/* Progress Bar with elegant editorial color scheme */}
        <div className="w-full h-1.5 bg-[#E8E4DA] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8B735B] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Center Question Segment */}
      <div className="my-5 space-y-4 flex-1 flex flex-col justify-center">
        <div>
          <h3 className="text-xl font-serif font-black text-[#2D2B28] leading-tight tracking-tight">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Big Tap Target Choices in Paper Editorial style */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left bg-white hover:bg-[#FAF9F6] rounded-2xl p-4 border border-[#D4D1C9] flex items-start gap-3 transition-all cursor-pointer hover:border-[#2D2B28] hover:scale-[1.005] shadow-xs active:scale-[0.995]"
            >
              <div className="h-4.5 w-4.5 rounded-full border-2 border-[#D4D1C9] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#2D2B28]">
                <div className="h-2 w-2 rounded-full bg-[#2D2B28] scale-100" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h4 className="text-xs font-extrabold text-[#2D2B28] leading-tight">{option.label}</h4>
                {option.description && (
                  <p className="text-[11px] text-[#2D2B28]/60 mt-1 leading-relaxed">{option.description}</p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-[#D4D1C9] shrink-0 self-center" />
            </button>
          ))}
        </div>
      </div>

      {/* "Why we Ask" educational footer - Crucial for "every question teaches" */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-[#D4D1C9] relative overflow-hidden shadow-xs">
          <div className="flex items-center gap-2 mb-1.5 justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#8B735B] stroke-[1.5]" />
              <h4 className="text-[9px] font-bold text-[#8B735B] uppercase tracking-widest font-mono">Why we ask this</h4>
            </div>
            <button
              onClick={() => setShowingTip(!showingTip)}
              className="text-[9px] text-[#2D2B28]/60 uppercase tracking-widest font-bold hover:text-[#2D2B28] underline font-mono cursor-pointer"
            >
              {showingTip ? 'Hide info' : 'Read info'}
            </button>
          </div>
          
          {showingTip && (
            <p className="text-[11px] text-[#2D2B28]/80 leading-relaxed font-serif italic pl-1.5 border-l border-[#8B735B]">
              {currentQuestion.whyWeAsk}
            </p>
          )}
        </div>

        {/* Live helper micro trigger */}
        <div className="flex justify-center">
          <button 
            onClick={() => onOpenQuickChat(currentQuestion.text)}
            className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#2D2B28]/85 hover:text-[#2D2B28] font-bold font-mono transition-opacity group cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#8B735B] group-hover:rotate-6 transition-transform" />
            <span>Need advice? Ask Chef Crumb</span>
          </button>
        </div>
      </div>
    </div>
  );
}
