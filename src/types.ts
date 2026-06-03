export type BakeCategory = 'bread' | 'cake' | 'pastry' | 'biscuits' | 'other';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  triggerDiagnosisId?: string; // Directly leads to a diagnosis if selected
}

export interface Question {
  id: string;
  text: string;
  category: BakeCategory;
  whyWeAsk: string; // Explains the science to the baker
  options: QuestionOption[];
  nextQuestionIdMap?: Record<string, string>; // Branching map: optionValue -> nextQuestionId
}

export interface Diagnosis {
  id: string;
  title: string;
  category: BakeCategory;
  confidence: 'High' | 'Medium' | 'We need more context';
  probability: string; // e.g. "85% matching symptoms"
  summary: string; // Short beginner summary
  scienceExplanation: string; // Intermediate baker scientific explanation
  actionSteps: string[]; // 2-3 actions to try next time
  educationalSnippet: string; // Quick baking tip
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface TroubleshootingSession {
  id: string;
  date: string;
  category: BakeCategory;
  answers: Record<string, { questionText: string; answerLabel: string; value: string }>;
  diagnosis: Diagnosis;
  chatHistory: ChatMessage[];
  completed: boolean;
}
