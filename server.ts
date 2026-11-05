import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Initialize Gemini client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // Endpoint: AI Camera Exam & Homework Scanner
  app.post('/api/gemini/solve-exam-camera', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', subject = 'General Exam', promptText = '' } = req.body;

      if (!imageBase64 && !promptText) {
        return res.status(400).json({ error: 'Image or text prompt is required' });
      }

      if (ai) {
        const contents: any[] = [];
        
        let instructions = `You are Mateo's High-Level AI Exam Tutor & Homework Solver.
The student has taken a camera photo or asked about an exam question in subject: ${subject}.
Provide an authoritative, clear, and comprehensive breakdown formatted with:
1. 🎯 **Question Summary**: What the question is asking in clear terms.
2. 💡 **Key Formula / Concept**: The underlying principle or theorem needed.
3. 📝 **Step-by-Step Solution**: Numbered step-by-step breakdown with intermediate calculations.
4. ✅ **Final Answer**: Clearly boxed/highlighted answer (with units if applicable).
5. ⚠️ **Common Exam Pitfalls & Pro-Tips**: Mistakes students make on this exact type of question.
Keep tone encouraging, concise, and focused on helping the student score 100% on their exam.`;

        if (promptText) {
          instructions += `\nAdditional Student Notes: "${promptText}"`;
        }

        contents.push({ text: instructions });

        if (imageBase64) {
          // Clean base64 prefix if present
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
          contents.push({
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
        });

        const solutionText = response.text || 'No solution text generated.';
        return res.json({
          success: true,
          solution: solutionText,
          model: 'gemini-2.5-flash',
          timestamp: new Date().toISOString(),
        });
      }

      // Offline / Fallback Intelligent Solver if API key is not yet configured
      const fallbackSolutions: Record<string, string> = {
        math: `🎯 **Question Summary**: Quadratic & Algebraic Function Optimization
💡 **Key Concept**: Vertex of parabola $y = ax^2 + bx + c$ occurs at $x = -b / (2a)$.
📝 **Step-by-Step Solution**:
1. Identify coefficients: $a = 1$, $b = -6$, $c = 8$.
2. Compute axis of symmetry: $x = -(-6) / (2 \\cdot 1) = 3$.
3. Evaluate minimum value: $f(3) = 3^2 - 6(3) + 8 = 9 - 18 + 8 = -1$.
4. Finding roots by factoring: $(x - 4)(x - 2) = 0 \\implies x = 2, 4$.
✅ **Final Answer**:
- Vertex (Minimum): **(3, -1)**
- Roots / X-intercepts: **x = 2 and x = 4**
⚠️ **Exam Pitfall**: Remember that negative times negative is positive when evaluating $-b / 2a$.`,

        chemistry: `🎯 **Question Summary**: Stoichiometry & Molar Mass Calculation
💡 **Key Concept**: $\\text{Moles} = \\frac{\\text{Mass (g)}}{\\text{Molar Mass (g/mol)}}$; $PV = nRT$ at STP.
📝 **Step-by-Step Solution**:
1. Find molar mass of Compound: e.g. $\\text{H}_2\\text{O} = (2 \\times 1.008) + 16.00 = 18.016\\text{ g/mol}$.
2. Convert given mass to moles: $n = 36.0\\text{ g} / 18.016\\text{ g/mol} = 2.00\\text{ moles}$.
3. Avogadro's conversion: $2.00 \\times 6.022 \\times 10^{23} = 1.204 \\times 10^{24}$ molecules.
✅ **Final Answer**: **2.00 moles (1.20 × 10²⁴ molecules)**
⚠️ **Exam Pitfall**: Always check significant figures and remember diatomic elements (H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂).`,

        biology: `🎯 **Question Summary**: Cellular Respiration vs. Photosynthesis Energy Flow
💡 **Key Concept**: Glycolysis $\\rightarrow$ Krebs Cycle $\\rightarrow$ Oxidative Phosphorylation generates $\\sim 30\\text{-}32\\text{ ATP}$.
📝 **Step-by-Step Solution**:
1. Glycolysis in cytoplasm: 1 Glucose $\\rightarrow$ 2 Pyruvate + net 2 ATP + 2 NADH.
2. Link reaction & Krebs cycle in mitochondrial matrix produces NADH and FADH₂.
3. Electron Transport Chain along inner mitochondrial membrane powers ATP synthase via proton gradient.
✅ **Final Answer**: **Aerobic respiration yields 30-32 net ATP per glucose; Fermentation yields only 2 ATP.**
⚠️ **Exam Pitfall**: Oxygen is the final electron acceptor in the ETC, forming H₂O. Without O₂, cellular respiration halts at glycolysis.`,

        physics: `🎯 **Question Summary**: Kinematics & Conservation of Mechanical Energy
💡 **Key Concept**: $E_{\\text{mech}} = KE + PE = \\text{constant}$; $v_f^2 = v_i^2 + 2ad$.
📝 **Step-by-Step Solution**:
1. At height $h = 20\\text{ m}$, potential energy $PE = mgh = m(9.8)(20) = 196m\\text{ Joules}$.
2. Assuming dropped from rest ($v_i = 0$), all $PE$ converts to $KE$: $\\frac{1}{2}mv_f^2 = mgh$.
3. Masses cancel: $v_f = \\sqrt{2gh} = \\sqrt{2 \\times 9.8 \\times 20} = \\sqrt{392} \\approx 19.8\\text{ m/s}$.
✅ **Final Answer**: **v = 19.80 m/s downwards**
⚠️ **Exam Pitfall**: Velocity is a vector; downward direction is negative if defined that way in the coordinate frame.`,
      };

      const lowerSubject = subject.toLowerCase();
      let key = 'math';
      if (lowerSubject.includes('chem')) key = 'chemistry';
      else if (lowerSubject.includes('bio')) key = 'biology';
      else if (lowerSubject.includes('phys')) key = 'physics';

      return res.json({
        success: true,
        solution: fallbackSolutions[key] || fallbackSolutions.math,
        model: 'gemini-exam-core (simulated)',
        isOfflineMode: true,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Gemini camera solve error:', err);
      return res.status(500).json({ error: err.message || 'Failed to process exam question' });
    }
  });

  // Endpoint: AI Distraction / Motivation Generator
  app.post('/api/gemini/distract', async (req, res) => {
    try {
      const { category = 'motivate' } = req.body;
      if (ai) {
        const prompt = `Give a high school student a quick 1-2 sentence witty study motivation, exam memory hack, or brain break joke for category: "${category}". Keep it punchy, funny, and clever.`;
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return res.json({ success: true, text: result.text });
      }

      const fallbacks: Record<string, string[]> = {
        motivate: [
          'Believe you can and you\'re halfway there! Review 15 minutes now and you\'ll cruise through the exam.',
          'The expert at anything was once a beginner. Stay locked in!',
          'Your future self will thank you for studying those last 3 formulas today.',
        ],
        hack: [
          'Memory Hack: Teach the concept out loud to an empty room (Feynman Technique). If you can explain it simply, you own it!',
          'Formula Hack: Units never lie! In physics, if your answer requires m/s, multiply or divide variables until units match m/s.',
        ],
        joke: [
          'Why did the student eat his homework? Because the teacher said it was a piece of cake!',
          'Parallel lines have so much in common... it’s a shame they’ll never meet.',
          'There are 10 types of people in the world: those who understand binary, and those who don’t.',
        ],
      };
      const list = fallbacks[category] || fallbacks.motivate;
      const pick = list[Math.floor(Math.random() * list.length)];
      return res.json({ success: true, text: pick });
    } catch (err: any) {
      return res.json({ success: true, text: 'Keep up the great work! You got this exam in the bag.' });
    }
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Mateo's Learning Server running on http://localhost:${PORT}`);
  });
}

startServer();
