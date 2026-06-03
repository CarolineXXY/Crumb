import { useState, useEffect } from 'react';
import { BakeCategory, TroubleshootingSession, ChatMessage } from './types';
import { getDiagnosisForAnswers } from './data/questions';
import { MobileFrame } from './components/MobileFrame';
import { HomeView } from './components/HomeView';
import { CategorySelectionView } from './components/CategorySelectionView';
import { SymptomFlowView } from './components/SymptomFlowView';
import { PhotoPromptView } from './components/PhotoPromptView';
import { DiagnosisView } from './components/DiagnosisView';
import { ChatView } from './components/ChatView';
import { HistoryView } from './components/HistoryView';
import { AIDrawer } from './components/AIDrawer';
import { ProfileView } from './components/ProfileView';

// Initial visual mock entries for immediate design polish & scannability
const INITIAL_DEMO_SESSIONS: TroubleshootingSession[] = [
  {
    id: 'demo-1',
    date: new Date(Date.now() - 4 * 1000 * 60 * 60 * 24).toISOString(), // 4 days ago
    category: 'bread',
    answers: {
      'bread_crumb': { questionText: 'Crumb structure', answerLabel: 'Dense, heavy, and slightly gummy', value: 'dense_gummy_heavy' },
      'bread_yeast_temp': { questionText: 'Water temperature', answerLabel: 'Comfortably hot to the touch', value: 'hot_water' }
    },
    diagnosis: {
      id: 'bread_dead_yeast',
      category: 'bread',
      title: 'The Unintentional Scalding (Dead Yeast)',
      confidence: 'High',
      probability: '92% match',
      summary: 'Your liquid was too hot for the yeast, meaning your rising agent was neutralized before fermentation even started.',
      scienceExplanation: 'At water temperatures exceeding 120°F (49°C), the Saccharomyces cerevisiae cell membranes permanently rupture, denaturing the enzymes needed to convert starches into carbon dioxide (CO2). Perfect yeast fluid is finger-warm (105°F).',
      actionSteps: [
        'Test mixing liquid with wrist first: if it feels warm like bathwater, it is safe; if hot, cool down.',
        'Try a slow room-temperature rise to eliminate heating risks.',
        'Bubble-test dry yeast packs in a warm sugary cup to verify cell viability.'
      ],
      educationalSnippet: 'Yeast behaves like a tiny baby: comfortable warmth is perfect, scalding heat is fatal!'
    },
    chatHistory: [],
    completed: true,
  },
  {
    id: 'demo-2',
    date: new Date(Date.now() - 1 * 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    category: 'cake',
    answers: {
      'cake_symptom': { questionText: 'Main visual defect', answerLabel: 'A deep crater in the very center', value: 'sunken_middle' },
      'cake_oven_door': { questionText: 'Opened oven door', answerLabel: 'Yes, just checked on it quick', value: 'opened_to_peek' }
    },
    diagnosis: {
      id: 'cake_premature_peek',
      category: 'cake',
      title: 'The Sneak-Peek Collapse (Thermal Drop)',
      confidence: 'High',
      probability: '85% match',
      summary: 'Opening the oven door let in cold air before the flour starches and egg proteins could bake solid, collapsing the delicate risen bubbles.',
      scienceExplanation: 'Before proteins set solid, rising cake depends on hot expanding gas pressure. Cracking the door drops oven temp by 30°F. The gas contracts instantly, collapsing the soft, pasty walls into a tragic crater.',
      actionSteps: [
        'Rely strictly on your oven window glass and light bulbs for the initial 25 minutes.',
        'Ensure the stove preheats for a solid 15 minutes before baking.',
        'Let the aroma of baked crumbs guide your toothpick test timing.'
      ],
      educationalSnippet: 'Cakes do not like surprises! Preheated baking chambers are sacred, draft-free spaces.'
    },
    chatHistory: [],
    completed: true,
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'troubleshoot' | 'history' | 'chat' | 'profile'>('troubleshoot');
  const [wizardState, setWizardState] = useState<'home' | 'photo-prompt' | 'category' | 'questions' | 'diagnosis'>('home');
  const [selectedCategory, setSelectedCategory] = useState<BakeCategory | null>(null);
  const [activeSession, setActiveSession] = useState<TroubleshootingSession | null>(null);
  
  // Custom photo parameters for active session
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [currentPhotoLabel, setCurrentPhotoLabel] = useState<string | null>(null);
  const [currentPhotoPreAnalysis, setCurrentPhotoPreAnalysis] = useState<string | null>(null);
  
  // Storage for audit logs
  const [history, setHistory] = useState<TroubleshootingSession[]>([]);
  
  // Floating quick-help drawer and its context variables
  const [globalChatOpen, setGlobalChatOpen] = useState(false);
  const [currentWizardQuestion, setCurrentWizardQuestion] = useState<string | undefined>(undefined);

  // Dedicated full Chat tab messaging state
  const [sessionChatMessages, setSessionChatMessages] = useState<ChatMessage[]>([]);

  // Safely restore data from localStorage on component load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('crumb_diagnostic_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Hydrate demo items so app feels instantly rich and educational
        setHistory(INITIAL_DEMO_SESSIONS);
        localStorage.setItem('crumb_diagnostic_history', JSON.stringify(INITIAL_DEMO_SESSIONS));
      }
    } catch (e) {
      console.warn('Unable to reach storage, simulating state.');
    }
  }, []);

  const saveHistoryToStorage = (updatedHistory: TroubleshootingSession[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem('crumb_diagnostic_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('LocalStorage save failures.');
    }
  };

  const handleStartTroubleshoot = () => {
    setSelectedCategory(null);
    setActiveSession(null);
    setCurrentPhotoUrl(null);
    setCurrentPhotoLabel(null);
    setCurrentPhotoPreAnalysis(null);
    setWizardState('photo-prompt');
    setActiveTab('troubleshoot');
  };

  const handleCategorySelected = (cat: BakeCategory) => {
    setSelectedCategory(cat);
    setWizardState('questions');
    setCurrentWizardQuestion(undefined);
  };

  const handleSymptomFlowComplete = (
    answers: Record<string, { questionText: string; answerLabel: string; value: string }>
  ) => {
    if (!selectedCategory) return;

    // Compile dynamic answer keys to find matching diagnosis recipe
    const answerKeyMap: Record<string, string> = {};
    Object.entries(answers).forEach(([qId, ans]) => {
      answerKeyMap[qId] = ans.value;
    });

    const matchedDiagnosis = getDiagnosisForAnswers(selectedCategory, answerKeyMap);

    // Create session audit log with photo parameters if available
    const newSession: TroubleshootingSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      category: selectedCategory,
      answers,
      diagnosis: matchedDiagnosis,
      chatHistory: [],
      completed: true,
      photoUrl: currentPhotoUrl || undefined,
      photoLabel: currentPhotoLabel || undefined,
      photoPreAnalysis: currentPhotoPreAnalysis || undefined,
    };

    const updatedHistory = [...history, newSession];
    saveHistoryToStorage(updatedHistory);
    
    setActiveSession(newSession);
    setWizardState('diagnosis');
  };

  const handleSelectHistorySession = (session: TroubleshootingSession) => {
    setActiveSession(session);
    setWizardState('diagnosis');
    setActiveTab('troubleshoot');
  };

  const handleRestartTroubleshoot = () => {
    handleStartTroubleshoot();
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Do you want to clear your baking diagnostic journal? Daily records assist skill growth!")) {
      saveHistoryToStorage([]);
    }
  };

  const handleLaunchAICompFromDiagnosis = () => {
    if (!activeSession) return;
    
    // Switch to dedicated full-tab chat and seed Chef with context immediately 
    setActiveTab('chat');
    
    let chatPreseedText = `### Double-checking custom science! 🧑‍🍳\n\nI see you are inquiring about **"${activeSession.diagnosis.title}"** inside the **${activeSession.category}** group.\n\nLet's study the physics of this! I can guide you through the water/flour measurements, discuss hot-spot thermal baking corrections, or explain enzyme fermentation ratios. What details can I clarify?`;

    // Visual companion acknowledgement which includes visual pre-analysis details
    if (activeSession.photoUrl) {
      chatPreseedText = `### Reviewing Forensic Visual Evidence 📸\n\nI see you uploaded an image of your **${activeSession.category}** for our audit report.\n\nLooking at the visual evidence of **"${activeSession.diagnosis.title}"** (*${activeSession.photoPreAnalysis || "crust surface irregularities detected"}*), the cell-walls of the gluten networks show strong signs of failure.\n\nLet's study how this happens! I can help you inspect liquid temperature profiles, evaluate structural gluten development, or map oven convection pathways. Which of these shall we look at first?`;
    }

    const initChefMsg: ChatMessage = {
      id: 'diag-chef-preseed',
      role: 'model',
      text: chatPreseedText,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };

    setSessionChatMessages([initChefMsg]);
  };

  const handleUpdateSessionChatMessages = (messages: ChatMessage[]) => {
    setSessionChatMessages(messages);
    if (activeSession) {
      const updatedSession: TroubleshootingSession = {
        ...activeSession,
        chatHistory: messages,
      };
      setActiveSession(updatedSession);
      const updatedHistory = history.map(s => s.id === activeSession.id ? updatedSession : s);
      saveHistoryToStorage(updatedHistory);
    }
  };

  const handleOpenGlobalChatFromNotch = (questionContextText?: string) => {
    setCurrentWizardQuestion(questionContextText);
    setGlobalChatOpen(true);
  };

  const handleCancelNewTroubleshoot = () => {
    setWizardState('home');
  };

  return (
    <MobileFrame
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenGlobalChat={() => handleOpenGlobalChatFromNotch()}
    >
      {/* 1. Troubleshoot Tab Router */}
      {activeTab === 'troubleshoot' && (
        <>
          {wizardState === 'home' && (
            <HomeView
              onStartNewTrouble={handleStartTroubleshoot}
              history={history}
              onSelectSession={handleSelectHistorySession}
              onOpenQuickChat={() => handleOpenGlobalChatFromNotch()}
            />
          )}

          {wizardState === 'photo-prompt' && (
            <PhotoPromptView
              onNext={(pUrl, pAnalysis) => {
                setCurrentPhotoUrl(pUrl);
                setCurrentPhotoLabel("Your bake · just now");
                setCurrentPhotoPreAnalysis(pAnalysis);
                setWizardState('category');
              }}
              onSkip={() => {
                setCurrentPhotoUrl(null);
                setCurrentPhotoLabel(null);
                setCurrentPhotoPreAnalysis(null);
                setWizardState('category');
              }}
            />
          )}

          {wizardState === 'category' && (
            <CategorySelectionView
              onSelectCategory={handleCategorySelected}
              onCancel={handleCancelNewTroubleshoot}
            />
          )}

          {wizardState === 'questions' && selectedCategory && (
            <SymptomFlowView
              category={selectedCategory}
              photoUrl={currentPhotoUrl}
              preAnalysis={currentPhotoPreAnalysis}
              onCancel={handleCancelNewTroubleshoot}
              onComplete={handleSymptomFlowComplete}
              onOpenQuickChat={(contextQuestion) => handleOpenGlobalChatFromNotch(contextQuestion)}
            />
          )}

          {wizardState === 'diagnosis' && activeSession && (
            <DiagnosisView
              session={activeSession}
              onBackToHome={() => setWizardState('home')}
              onLaunchAIChat={handleLaunchAICompFromDiagnosis}
              onRestartTroubleshoot={handleRestartTroubleshoot}
            />
          )}
        </>
      )}

      {/* 2. Baking Journal ( History Tab ) */}
      {activeTab === 'history' && (
        <HistoryView
          history={history}
          onSelectSession={handleSelectHistorySession}
          onClearHistory={handleClearAllHistory}
        />
      )}

      {/* 3. Dedicated Chef AI Chat Tab */}
      {activeTab === 'chat' && (
        <ChatView
          currentDiagnosis={activeSession?.diagnosis}
          category={activeSession?.category}
          answers={activeSession?.answers}
          sessionMessages={sessionChatMessages}
          onSetSessionMessages={handleUpdateSessionChatMessages}
          onBackToHome={() => setActiveTab('troubleshoot')}
        />
      )}

      {/* 4. Baker Registry Profile Tab */}
      {activeTab === 'profile' && (
        <ProfileView
          history={history}
          onBackToHome={() => setActiveTab('troubleshoot')}
        />
      )}

      {/* 5. Global persistent helper sliding overlay (AIDrawer) */}
      <AIDrawer
        isOpen={globalChatOpen}
        onClose={() => setGlobalChatOpen(false)}
        currentDiagnosis={activeSession?.diagnosis}
        category={activeSession?.category}
        wizardQuestionContext={currentWizardQuestion}
      />
    </MobileFrame>
  );
}
