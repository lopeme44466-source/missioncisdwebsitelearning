import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  FileText, 
  Flame, 
  HelpCircle, 
  ShieldAlert, 
  Zap, 
  Brain, 
  Award, 
  EyeOff,
  BookOpen
} from 'lucide-react';

const PRESET_QUICK_PROMPTS = {
  excuse: [
    'Why my math homework isn\'t turned in today',
    'Why I was 20 minutes late to 2nd period English',
    'Why my group presentation file is corrupted',
    'Why I need to use the restroom during a pop quiz'
  ],
  roast: [
    'Find x if 2x^2 + 5x - 12 = 0 and explain the economic significance',
    'Why do we need to analyze what the blue curtains represent in Gatsby?',
    'Write a 5-page essay on the agricultural reforms of ancient Mesopotamia',
    'Explain the Krebs cycle in detail without using Google'
  ],
  brainrot_translator: [
    'The industrial revolution significantly altered the socioeconomic landscape of Western Europe.',
    'I did not complete the assignment because my internet connection experienced unexpected latency.',
    'Please refrain from conversing during the examination period.',
    'The biological membrane demonstrates selective permeability to maintain homeostasis.'
  ],
  fake_note: [
    'Emergency hall pass to the library for urgent book return',
    'Exemption note from running the mile in gym class due to ankle sprain',
    'Bathroom pass for excessive hydration needs',
    'Parent note apologizing for homework being eaten by a rogue lawnmower'
  ],
  trivia_battle: [
    'Is a hot dog considered a sandwich or a taco?',
    'Which teacher at school would survive the zombie apocalypse longest?',
    'If you punch yourself and it hurts, are you weak or strong?',
    'Could 1 billion lions beat the Sun?'
  ]
};

export const AiDistractionApp = ({ onTriggerPanic }) => {
  const [activeMode, setActiveMode] = useState('excuse'); // excuse, roast, brainrot_translator, fake_note, trivia_battle
  const [userInput, setUserInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCloakedAsStudy, setIsCloakedAsStudy] = useState(false);

  const handleGenerate = async (customPrompt) => {
    const promptToSend = customPrompt || userInput;
    if (!promptToSend && activeMode !== 'excuse' && activeMode !== 'fake_note') return;

    setIsLoading(true);
    setCopied(false);

    try {
      const response = await fetch('/api/gemini/distract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          prompt: promptToSend || `Generate a random ${activeMode} for classroom entertainment`,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setAiOutput(data.text);
      } else {
        setAiOutput('Error generating content. Please try again!');
      }
    } catch (err) {
      console.error('AI fetch error:', err);
      setAiOutput('⚠️ Network error or offline mode. Check connection!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiOutput) return;
    navigator.clipboard?.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Cloaked boring view if a teacher is looking
  if (isCloakedAsStudy) {
    return (
      <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-xl font-serif space-y-4 max-w-3xl mx-auto border border-slate-300">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>AP Calculus BC &bull; Problem Set 4.2: Integration by Parts</span>
          </div>
          <button
            onClick={() => setIsCloakedAsStudy(false)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded border border-slate-300 cursor-pointer"
          >
            Exit Disguise (Click to Resume)
          </button>
        </div>

        <h3 className="text-xl font-bold font-serif">Theorem 4.12: Second Order Differential Equation Verification</h3>
        <p className="text-sm leading-relaxed text-slate-700">
          Let <span className="italic">y = f(x)</span> be a continuous function on the closed interval <span className="italic">[a, b]</span>. If the second derivative <span className="italic">d²y/dx² + k²y = 0</span> holds for all real numbers <span className="italic">k &gt; 0</span>, evaluate the boundary condition at <span className="italic">x = 0</span> where <span className="italic">y(0) = 1</span> and <span className="italic">y'(0) = 0</span>.
        </p>
        <div className="bg-slate-50 p-4 rounded border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
          <p>∫ u dv = uv - ∫ v du</p>
          <p>Let u = x², dv = e^(2x) dx</p>
          <p>du = 2x dx, v = (1/2) e^(2x)</p>
          <p>Result = (1/2) x² e^(2x) - ∫ x e^(2x) dx = (1/2) x² e^(2x) - (1/2) x e^(2x) + (1/4) e^(2x) + C</p>
        </div>
        <p className="text-xs text-slate-400 italic">
          *Note for student review: Remember to verify the constant of integration before the end of the testing period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 sm:px-5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20 font-black text-white">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">Brainrot AI Distraction Suite</h2>
              <span className="text-[10px] uppercase font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Homework excuse generator, teacher roaster, Gen-Z brainrot translator, & fake hall passes
            </p>
          </div>
        </div>

        {/* Quick disguise button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCloakedAsStudy(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all cursor-pointer"
            title="Instant disguise: turns screen into Calculus proof"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Disguise as Calculus</span>
          </button>

          {onTriggerPanic && (
            <button
              onClick={onTriggerPanic}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
              title="Emergency Panic"
            >
              <EyeOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Panic</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <button
          onClick={() => { setActiveMode('excuse'); setAiOutput(''); }}
          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
            activeMode === 'excuse'
              ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Excuses</span>
        </button>

        <button
          onClick={() => { setActiveMode('roast'); setAiOutput(''); }}
          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
            activeMode === 'roast'
              ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Roast Work</span>
        </button>

        <button
          onClick={() => { setActiveMode('brainrot_translator'); setAiOutput(''); }}
          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
            activeMode === 'brainrot_translator'
              ? 'bg-pink-600 text-white border-pink-400 shadow-lg shadow-pink-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>Brainrot Slang</span>
        </button>

        <button
          onClick={() => { setActiveMode('fake_note'); setAiOutput(''); }}
          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
            activeMode === 'fake_note'
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fake Hall Pass</span>
        </button>

        <button
          onClick={() => { setActiveMode('trivia_battle'); setAiOutput(''); }}
          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
            activeMode === 'trivia_battle'
              ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-yellow-300" />
          <span>Debate Igniter</span>
        </button>
      </div>

      {/* Main Interactive Work Area */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
        {/* Preset Quick Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Scenarios:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUICK_PROMPTS[activeMode]?.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUserInput(prompt);
                  handleGenerate(prompt);
                }}
                className="text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>
              {activeMode === 'excuse' && 'What do you need an excuse for?'}
              {activeMode === 'roast' && 'Paste the homework question or assignment to roast:'}
              {activeMode === 'brainrot_translator' && 'Enter text to translate into Brainrot or Victorian formal:'}
              {activeMode === 'fake_note' && 'Specify hall pass or excuse note details:'}
              {activeMode === 'trivia_battle' && 'Enter a topic to generate a classroom debate question:'}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">Powered by Gemini 3.8 Flash</span>
          </label>

          <div className="flex gap-2">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type anything here or pick a quick scenario above..."
              rows={2}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-5 rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-purple-500/20 transition-all cursor-pointer shrink-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Output Result Box */}
        {aiOutput && (
          <div className="mt-4 bg-slate-950 border border-purple-500/30 rounded-xl p-4 sm:p-5 space-y-3 animate-in fade-in duration-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                AI Generated Result
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                  title="Regenerate"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {aiOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
