import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn('Warning: GEMINI_API_KEY is not defined. AI Chat features will fall back to smart local simulations.');
      throw new Error('GEMINI_API_KEY is required');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST API for baking troubleshooting AI companion
app.post('/api/troubleshoot/chat', async (req, res) => {
  try {
    const { history, currentDiagnosis, category, answers } = req.body;

    // Build historical context injection
    let answersFormatted = '';
    if (answers && Object.keys(answers).length > 0) {
      answersFormatted = Object.entries(answers)
        .map(([id, ans]: [string, any]) => `- Question: "${ans.questionText}" -> Answer: "${ans.answerLabel}"`)
        .join('\n');
    }

    const diagnosisContext = currentDiagnosis
      ? `
CURRENT TROUBLESHOOTING SESSION INFORMATION:
- Bake Category: ${category}
- Reached Diagnosis: "${currentDiagnosis.title}" (Confidence: ${currentDiagnosis.confidence}, Probability: ${currentDiagnosis.probability})
- Diagnosis Summary: ${currentDiagnosis.summary}
- Scientific Culprit: ${currentDiagnosis.scienceExplanation}
- Actionable advice given to user:
${currentDiagnosis.actionSteps?.map((step: string, i: number) => `  ${i + 1}. ${step}`).join('\n')}

USER COMPLETED DIAGNOSTIC SELECTIONS:
${answersFormatted}
`
      : `
- Bake Category: ${category || 'General Baking'}
- Reached Diagnosis: No diagnosis achieved yet. The user is checking general tips.
`;

    const systemInstruction = `You are a friendly, patient, and highly knowledgeable pastry chef and baking scientist named Chef Crumb.
Your tone is encouraging, clear, and sensory (mentioning the aromas, textures, and science of baking).
You talk to the user like a patient friend who genuinely wants them to master baking. Never patronize, but explain intermediate science concepts in plain, helpful language.

${diagnosisContext}

CRITICAL RULES:
1. Always acknowledge the current troubleshooting context in your answers where relevant.
2. Provide short, beautifully styled markdown, using bold titles and clean scannable bullet points.
3. Suggest simple, small experiments (e.g., of temperatures, wet-vs-dry ratios, or gluten checks like the windowpane test).
4. If asked about unrelated issues (like cars or programming), politely steer them back to flour, water, yeast, dough, oven chemistry, and pastry!
5. Stay humble and encourage the baker: "Baking is just tasty chemistry. Every failed loaf is just step one to a perfect crumb!"`;

    // Map history to standard Parts structure
    // history: Array of { role: 'user'|'model', text: string }
    const contents = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    try {
      const client = getAiClient();
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Chef Crumb is thinking... I apologize, my oven heat seems to have dipped. Could you ask that again?";
      return res.json({ text: replyText });
    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError);
      
      // Simulated Fallback for when API keys are not supplied yet
      const lastUserMsg = history[history.length - 1]?.text || '';
      const fallbackReply = simulatePastryChefReply(lastUserMsg, currentDiagnosis, category);
      return res.json({ 
        text: fallbackReply, 
        isSimulation: true 
      });
    }
  } catch (err: any) {
    console.error('Server error during processing:', err);
    res.status(500).json({ error: 'Failed to process advice from Chef Crumb.' });
  }
});

// A highly realistic simulator of the Chef Crumb AI so that if the user does not have a key,
// the preview still works perfectly, beautifully, and satisfyingly!
function simulatePastryChefReply(msg: string, diagnosis: any, category: string): string {
  const query = msg.toLowerCase();
  
  if (diagnosis) {
    if (query.includes('why') || query.includes('science') || query.includes('how')) {
      return `### Let's look at the science behind **${diagnosis.title}** 🧪\n\nWhen we bake, we are working with a delicate balance of moisture, heat, and protein structures.\n\nIn your case, ${diagnosis.scienceExplanation}\n\nTo correct this in your next attempt:\n1. **Weigh your dry flour** onto a kitchen scale instead of scooping.\n2. **Check oven temps** with a separate hangs thermometer.\n\nWould you like me to explain how to perform the windowpane test or double-check if your yeast is still alive?`;
    }
    
    if (query.includes('yeast') || query.includes('proof') || query.includes('rise')) {
      return `### Let's master hydration & proofing! 🍞\n\nYeast is a living ecosystem that requires moisture, thermal warmth (75°F-85°F), and digestible starches. \n\nIf you proof dough in an environment that is too hot, it expands too rapidly and collapses. If too cold, it remains dense. In your troubleshooting sequence, you highlighted symptoms related to **${diagnosis.title}**.\n\n**Try this test:** GENTLY poke the dough with your index finger. If the indent springs back slowly and leaves a faint dimple, the oven waits for it. If it bounces back immediately like a rubber ball, it needs another 20 minutes!`;
    }
  }

  // General baking replies
  return `### Hello Friend! Chef Crumb here. 👋\n\nBaking is just scrumptious, edible chemistry! I see you are dealing with a **${category || 'baking'}** experiment. \n\n${diagnosis ? `Your symptoms point to **${diagnosis.title}** (Confidence: ${diagnosis.confidence}).` : 'What are you baking today? I can help you understand flour weights, rising agents, pie crust chilling, or oven hotspots.'}\n\nHow can I help you tweak your technique? You can ask me:\n- *"Why we should weigh flour in grams instead of volume cups?"*\n- *"How do I keep my pie crust butter from melting?"*\n- *"How do I test if my old baking powder is dead?"*`;
}

// Vite middleware for development vs static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Crumb Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
