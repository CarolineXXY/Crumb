import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import { ChatMessage, Diagnosis } from '../types';

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDiagnosis?: Diagnosis;
  category?: string;
  wizardQuestionContext?: string;
}

export function AIDrawer({ isOpen, onClose, currentDiagnosis, category, wizardQuestionContext }: AIDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial message when drawer triggers or question context changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (wizardQuestionContext) {
        setMessages([
          {
            id: 'wizard-helper',
            role: 'model',
            text: `### Stuck on this question? I\'ve got answers! 🧑‍🍳\n\nYou\'re answering: *"${wizardQuestionContext}"*.\n\nLet\'s talk about what molecular changes occur here. Ask me why we ask this, or how to check your conditions!`,
            timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else if (currentDiagnosis) {
        setMessages([
          {
            id: 'diag-helper',
            role: 'model',
            text: `### Looking closer at "${currentDiagnosis.title}"? 🧬\n\nI can expand on the scientific culprit, teach you the starch/moisture balance, or suggest how to customize the recipe. Ask away!`,
            timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages([
          {
            id: 'global-helper',
            role: 'model',
            text: `### Let\'s talk baking science! 🌾\n\nChef Crumb here. I remain floating at the margin of your baking tray to answer questions at any stage. What can I clarify for you?`,
            timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
  }, [isOpen, wizardQuestionContext, currentDiagnosis, messages.length]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
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
          answers: {},
        }),
      });

      const data = await response.json();
      
      const chefMsg: ChatMessage = {
        id: `chef-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...updatedHistory, chefMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `chef-err-${Date.now()}`,
        role: 'model',
        text: `### Flour line blockage! 🌾\n\nMy scientific network is slightly backed up. Remember, if we work with pastry, keep the butter firm and cold, and if baking yeast loaves, feed them finger-warm water (105°F). Ask me again once the oven exhausts clearing.`,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedHistory, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2D2B28]/60 z-50 rounded-[44px]"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-0 inset-x-0 h-[80%] bg-[#FAF9F6] border-t border-[#D4D1C9] shadow-2xl rounded-t-[36px] flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white border-b border-[#D4D1C9] p-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8B735B]" />
                <span className="text-xs font-serif font-medium text-[#2D2B28] uppercase tracking-wider">Case Enquiry Chat</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-stone-400 hover:text-[#2D2B28] rounded-full hover:bg-[#FAF9F6] transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-[11px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#2D2B28] text-white rounded-tr-none shadow-xs font-sans'
                        : 'bg-white text-[#2D2B28] border border-[#D4D1C9] rounded-tl-none shadow-xs font-sans'
                    }`}
                  >
                    {/* Simplified markdown line printing */}
                    <div className="space-y-1 font-sans">
                      {msg.text.split('\n').map((line, ix) => {
                        if (line.startsWith('###')) {
                          return (
                            <h4 key={ix} className="font-serif font-medium text-xs text-[#2D2B28] uppercase tracking-wider mt-1">
                              {line.replace('###', '').trim()}
                            </h4>
                          );
                        }
                        return <p key={ix}>{line}</p>;
                      })}
                    </div>
                  </div>
                  <span className="text-[8.5px] text-stone-400 mt-1 px-1 font-sans italic uppercase tracking-wider">{msg.timestamp}</span>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-1.5 p-2 bg-white border border-[#D4D1C9] rounded-xl mr-auto max-w-[80%] text-[10px] font-sans italic text-[#8B735B] leading-none uppercase tracking-wider animate-pulse">
                  <span>Chef is checking the oven...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="bg-white border-t border-[#D4D1C9] p-3 shrink-0 flex items-center gap-2 pb-5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(inputText);
                }}
                disabled={isLoading}
                placeholder="Ask advice on flour or temperature..."
                className="flex-1 bg-[#FAF9F6] rounded-xl px-3 py-1.5 text-xs text-[#2D2B28] border border-[#D4D1C9] focus:outline-none focus:border-[#2D2B28]"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="bg-[#2D2B28] text-white p-2 rounded-xl flex items-center justify-center transition disabled:opacity-35 cursor-pointer hover:bg-[#8B735B]"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
