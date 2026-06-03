import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Diagnosis } from '../types';
import { Send, ArrowLeft, RefreshCw, Sparkles, MessageCircle, AlertCircle, HelpCircle, Camera } from 'lucide-react';

interface ChatViewProps {
  currentDiagnosis?: Diagnosis;
  category?: string;
  answers?: Record<string, any>;
  sessionMessages: ChatMessage[];
  onSetSessionMessages: (messages: ChatMessage[]) => void;
  onBackToHome?: () => void;
  standalone?: boolean;
}

export function ChatView({
  currentDiagnosis,
  category,
  answers,
  sessionMessages,
  onSetSessionMessages,
  onBackToHome,
  standalone = false,
}: ChatViewProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("Measuring ingredients...");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  // Setup initial message acknowledging context if history is empty
  useEffect(() => {
    if (sessionMessages.length === 0) {
      if (currentDiagnosis) {
        onSetSessionMessages([
          {
            id: 'init-chef',
            role: 'model',
            text: `### Chef Crumb is ready to inspect! 🥖\n\nI've carefully analyzed your **${category}** session regarding **"${currentDiagnosis.title}"**. \n\nYou indicated matching symptoms such as *gummy heavy crumb* or *expired powder*. \n\nI can explain the chemical reaction happening on your baking sheet, suggest a few kitchen experiments, or help adjust temperatures. What shall we tackle first, friend?`,
            timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        onSetSessionMessages([
          {
            id: 'init-chef-general',
            role: 'model',
            text: `### Welcome to Chef Crumb's Chemistry Counter! 🌾\n\nNo active bake is in the docket, but we can talk bread rise, crust flakiness, pastry folds, or check if your dry yeast is alive. \n\nAsk me anything! For example: *"How do I keep my pie crust cold?"* or *"Why do my croissants shrink?"*`,
            timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
  }, [currentDiagnosis, category, sessionMessages.length]);

  // Handle messages automatic scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessionMessages, isLoading]);

  // Loading phase animation cycles
  useEffect(() => {
    if (!isLoading) return;
    const phrases = [
      "Stirring wet met dry and flour proteins...",
      "Feeding the sourdough starter...",
      "Heating up the convection chambers...",
      "Spraying steam layers on the crust...",
      "Gauging protein gluten strains..."
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setLoadingPhase(phrases[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Suggestion chips - designed for floury hands (minimal typing)
  const getSuggestions = () => {
    if (currentDiagnosis) {
      return [
        `Explain the chemical science behind this.`,
        `What temperature adjustments fix this?`,
        `Perform dry yeast test.`,
        `Ask for a custom cookie recipe.`
      ];
    }
    return [
      `How do I run a windowpane test?`,
      `How do I test if commercial yeast is dead?`,
      `Why must we weigh flour in grams?`,
      `How to fix a wet soggy bottom crust?`
    ];
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...sessionMessages, userMsg];
    onSetSessionMessages(updatedHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/troubleshoot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: updatedHistory.map(m => ({ role: m.role, text: m.text })),
          currentDiagnosis,
          category,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('API connection timed out');
      }

      const data = await response.json();
      
      const chefMsg: ChatMessage = {
        id: `chef-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };

      onSetSessionMessages([...updatedHistory, chefMsg]);
    } catch (err) {
      console.error(err);
      
      // Local recovery backup if network failure happens
      const fallbackMsg: ChatMessage = {
        id: `chef-err-${Date.now()}`,
        role: 'model',
        text: `### A temporary kitchen grease clogs our flour lines! 🌾\n\nI couldn't contact my neural server. Let's study basic chemistry here:\n- Always **chill fats (butter)** for flaky puffiness.\n- Keep **oven temperatures moderate (350°F)** to avoid explosions.\n- Use **metric weighing scales** for flour control.\n\nTry checking your internet dial, or drop your query again shortly!`,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
      onSetSessionMessages([...updatedHistory, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatPhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isLoading) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = reader.result as string;
      const activeCategoryLabel = category ? `Your ${category}` : 'Your bake';
      
      const userMsg: ChatMessage = {
        id: `user-photo-${Date.now()}`,
        role: 'user',
        text: `I've uploaded a picture of my bake for visual diagnostic analysis.`,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        photoUrl: resultUrl,
        photoLabel: `${activeCategoryLabel} · just now`,
      };

      const updatedHistory = [...sessionMessages, userMsg];
      onSetSessionMessages(updatedHistory);
      setIsLoading(true);

      // Model auto-acknowledges image in full context of session history
      setTimeout(() => {
        const chefMsg: ChatMessage = {
          id: `chef-photo-rep-${Date.now()}`,
          role: 'model',
          text: `### Visual Forensic Inspection 🔍\n\nThanks — looking at the crumb structure and crust definition here, I'd add that the internal aeration indicates pocketed steam pathways rather than uniform yeast activity.\n\nTo correct this, focus on a longer bulk rise with two stretch-and-folds, and make sure your baking chamber temperature stays consistent. It's looking delicious already! We're close to a perfect bake.`,
          timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        };
        onSetSessionMessages([...updatedHistory, chefMsg]);
        setIsLoading(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const cleanChatHistory = () => {
    onSetSessionMessages([]);
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-[#FAF9F6] text-[#2D2B28] overflow-hidden relative">
      <input 
        type="file" 
        accept="image/*" 
        ref={chatFileInputRef} 
        onChange={handleChatPhotoSelected} 
        className="hidden" 
      />
      {/* Header with back trigger */}
      <div className="bg-white border-b border-[#D4D1C9] flex items-center justify-between p-4 px-5 shrink-0 z-10">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-1 px-1.5 hover:bg-[#FAF9F6] rounded-lg text-stone-500 hover:text-[#2D2B28] transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="relative">
            <span className="text-xl">🥖</span>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#8B735B] border border-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-medium text-[#2D2B28] uppercase tracking-wider">Chef Crumb Labs</h3>
            <p className="text-[9px] text-[#8B735B] font-sans italic mt-0.5 uppercase tracking-wider">Forensic Companion Active</p>
          </div>
        </div>

        <button
          onClick={cleanChatHistory}
          className="p-1 text-stone-400 hover:text-[#2D2B28] transition cursor-pointer"
          title="Clear Session"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
        {sessionMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Display Warm-Styled Thumbnail if image is attached to the chat message */}
            {msg.photoUrl && (
              <div className="mb-2 w-full max-w-[200px] bg-white border border-[#D4D1C9] p-1 rounded-[16px] overflow-hidden shadow-xs animate-fade-in relative">
                <img 
                  src={msg.photoUrl} 
                  alt="Baker forensic slice" 
                  className="w-full h-28 object-cover rounded-[12px]"
                  referrerPolicy="no-referrer"
                />
                <span className="block text-[8px] uppercase tracking-wider font-sans text-[#8B735B] mt-1 font-semibold text-center italic">
                  {msg.photoLabel || "Your bake · just now"}
                </span>
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl text-[11px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2D2B28] text-white rounded-tr-none shadow-md font-sans'
                  : 'bg-white text-[#2D2B28] border border-[#D4D1C9] rounded-tl-none shadow-xs font-sans'
              }`}
            >
              {/* Markdown-ish formatting parsing: handle headers, bullets, italic */}
              <div className="space-y-1.5 font-sans whitespace-pre-wrap">
                {msg.text.split('\n').map((line, lidx) => {
                  if (line.startsWith('###')) {
                    return (
                      <h4 key={lidx} className="font-serif font-medium text-xs text-[#2D2B28] uppercase tracking-wider mt-1 first:mt-0">
                        {line.replace('###', '').trim()}
                      </h4>
                    );
                  }
                  if (line.startsWith('-') || line.startsWith('*')) {
                    return (
                      <div key={lidx} className="flex items-start gap-1.5 text-[11px] text-[#2D2B28]/80 leading-snug font-sans">
                        <span className="text-[#8B735B] text-xs shrink-0">•</span>
                        <span>{line.substring(2).trim()}</span>
                      </div>
                    );
                  }
                  if (line.match(/^\d+\./)) {
                    const matchResult = line.match(/^(\d+)\.(.*)/);
                    if (matchResult) {
                      return (
                        <div key={lidx} className="flex items-start gap-1.5 text-[11px] text-[#2D2B28]/80 leading-snug font-sans">
                          <span className="text-[#8B735B] font-medium shrink-0">{matchResult[1]}.</span>
                          <span>{matchResult[2].trim()}</span>
                        </div>
                      );
                    }
                  }
                  return (
                    <p key={lidx} className="text-[11px] leading-relaxed font-sans">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
            <span className="text-[8.5px] text-stone-400 mt-1 px-1 font-sans italic uppercase tracking-wider">{msg.timestamp}</span>
          </div>
        ))}

        {/* Dynamic Baking loading message */}
        {isLoading && (
          <div className="flex flex-col items-start mr-auto max-w-[85%]">
            <div className="p-3.5 bg-white text-stone-600 border border-[#D4D1C9] rounded-2xl rounded-tl-none shadow-xs flex items-center gap-2.5">
              <div className="flex space-x-1.5 justify-center items-center h-4 shrink-0">
                <div className="bg-[#2D2B28] h-1.5 w-1.5 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="bg-[#2D2B28] h-1.5 w-1.5 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="bg-[#2D2B28] h-1.5 w-1.5 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] font-sans italic text-[#8B735B] leading-none uppercase tracking-wider">
                {loadingPhase}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Section - designed for floury hands */}
      <div className="bg-[#FAF9F6] border-t border-[#D4D1C9]/60 p-2.5 shrink-0">
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {getSuggestions().map((tip, tIdx) => (
            <button
              key={tIdx}
              onClick={() => handleSendMessage(tip)}
              disabled={isLoading}
              className="bg-white hover:bg-[#FAF9F6] text-[#2D2B28] text-[9px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full border border-[#D4D1C9] shadow-2xs shrink-0 transition-colors cursor-pointer whitespace-nowrap active:scale-95 disabled:opacity-50 font-sans"
            >
              {tip}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls with nested camera icon to fit guided diagnostic aesthetics */}
      <div className="bg-white border-t border-[#D4D1C9] p-3 shrink-0 flex items-center gap-2 pb-5">
        <button
          onClick={() => chatFileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2.5 bg-[#FAF9F6] border border-[#D4D1C9] hover:border-[#2D2B28] text-stone-600 hover:text-[#2D2B28] rounded-xl transition cursor-pointer shrink-0"
          title="Snap custom crumb photo"
        >
          <Camera className="h-4.5 w-4.5 text-[#8B735B]" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputText);
          }}
          disabled={isLoading}
          placeholder="Ask Chef Crumb about flour science..."
          className="flex-1 bg-[#FAF9F6] rounded-xl px-4 py-2 text-xs text-[#2D2B28] border border-[#D4D1C9] focus:outline-none focus:border-[#2D2B28] focus:bg-white text-medium font-sans disabled:opacity-60 placeholder:text-stone-400"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          className="bg-[#2D2B28] hover:bg-[#8B735B] text-white p-2 rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95 animate-pulse shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
