import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Flame,
  HelpCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

const EXAM_DATA = {
  'sat-math': {
    title: 'SAT Mathematics & Algebra Cram',
    timeLimit: 300, // 5 min
    questions: [
      {
        q: 'If 3x + 5 = 20, what is the value of 6x - 2?',
        options: ['10', '28', '30', '38'],
        correct: 1, // 28: 3x = 15 => x = 5. 6(5) - 2 = 28
        explanation: 'Subtract 5: 3x = 15, so x = 5. Plug into 6x - 2: 6(5) - 2 = 30 - 2 = 28.',
      },
      {
        q: 'Which of the following points lies on the line defined by y = 2x - 3?',
        options: ['(1, -1)', '(2, 2)', '(-1, -4)', '(3, 4)'],
        correct: 0, // (1, -1): 2(1) - 3 = -1
        explanation: 'Test (1, -1): y = 2(1) - 3 = -1, which matches!',
      },
      {
        q: 'What is the sum of the solutions to (x - 4)(x + 2) = 0?',
        options: ['-2', '2', '4', '6'],
        correct: 1, // x = 4 and x = -2; sum = 2
        explanation: 'Roots are x = 4 and x = -2. Sum: 4 + (-2) = 2.',
      },
      {
        q: 'In a right triangle, sin(θ) = 3/5. What is cos(θ)?',
        options: ['3/4', '4/5', '5/3', '4/3'],
        correct: 1, // 4/5: 3-4-5 Pythagorean triple
        explanation: 'This is a standard 3-4-5 right triangle. cos(θ) = adjacent / hypotenuse = 4/5.',
      },
      {
        q: 'If f(x) = 2x² - 3x + 1, what is the value of f(-2)?',
        options: ['3', '15', '7', '-1'],
        correct: 1, // 2(4) - 3(-2) + 1 = 8 + 6 + 1 = 15
        explanation: 'f(-2) = 2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15.',
      },
    ],
    cheatSheet: [
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a',
      'Vertex of Parabola: x = -b / (2a)',
      'Slope-Intercept: y = mx + b, where m = (y₂ - y₁) / (x₂ - x₁)',
      'Pythagorean Triples to memorize: 3-4-5, 5-12-13, 8-15-17',
    ],
  },
  'ap-bio': {
    title: 'AP Biology Cell & Genetics Exam',
    timeLimit: 300,
    questions: [
      {
        q: 'Which organelle is the primary site of ATP synthesis during aerobic cellular respiration?',
        options: ['Ribosome', 'Golgi Apparatus', 'Mitochondria', 'Lysosome'],
        correct: 2,
        explanation: 'Mitochondria generate ATP via Krebs cycle and electron transport chain chemiosmosis.',
      },
      {
        q: 'During which phase of meiosis do homologous chromosomes cross over and exchange genetic material?',
        options: ['Prophase I', 'Metaphase II', 'Anaphase I', 'Telophase II'],
        correct: 0,
        explanation: 'Crossing over (chiasmata formation) occurs during Prophase I of meiosis.',
      },
      {
        q: 'What is the role of DNA Polymerase III during prokaryotic DNA replication?',
        options: ['Unwinds the double helix', 'Synthesizes leading and lagging strands 5\' to 3\'', 'Joins Okazaki fragments', 'Synthesizes RNA primers'],
        correct: 1,
        explanation: 'DNA Polymerase III adds complementary nucleotides in the 5\' to 3\' direction.',
      },
      {
        q: 'Which of the following molecules acts as the final electron acceptor in aerobic respiration?',
        options: ['NAD+', 'Oxygen (O₂)', 'Water (H₂O)', 'Carbon Dioxide (CO₂)'],
        correct: 1,
        explanation: 'Oxygen captures low-energy electrons and protons at complex IV, yielding H₂O.',
      },
      {
        q: 'In a Mendelian cross between two heterozygotes (Aa × Aa), what is the expected genotypic ratio?',
        options: ['3:1', '1:2:1', '9:3:3:1', '1:1'],
        correct: 1,
        explanation: 'Genotypes: 1 AA : 2 Aa : 1 aa (phenotypic ratio is 3:1).',
      },
    ],
    cheatSheet: [
      'Photosynthesis: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂',
      'Cellular Respiration: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ~30-32 ATP',
      'Hardy-Weinberg: p + q = 1 and p² + 2pq + q² = 1',
      'Enzyme Kinetics: High substrate concentration reaches Vmax.',
    ],
  },
  'ap-chem': {
    title: 'AP Chemistry Stoichiometry & Equilibrium',
    timeLimit: 300,
    questions: [
      {
        q: 'What is the molar mass of Calcium Carbonate (CaCO₃)? (Ca=40.08, C=12.01, O=16.00)',
        options: ['68.09 g/mol', '100.09 g/mol', '84.09 g/mol', '116.09 g/mol'],
        correct: 1,
        explanation: '40.08 + 12.01 + (3 × 16.00) = 40.08 + 12.01 + 48.00 = 100.09 g/mol.',
      },
      {
        q: 'According to Le Chatelier\'s principle, what happens when pressure increases on the system: N₂(g) + 3H₂(g) ⇌ 2NH₃(g)?',
        options: ['Shifts to the left (reactants)', 'Shifts to the right (products)', 'No change in equilibrium', 'Temperature drops instantly'],
        correct: 1,
        explanation: 'Reactants have 4 gas moles; products have 2 gas moles. Higher pressure favors fewer gas molecules (right).',
      },
      {
        q: 'What is the pH of a 0.001 M HCl aqueous solution?',
        options: ['1', '2', '3', '7'],
        correct: 2,
        explanation: 'HCl is a strong acid: [H+] = 10⁻³ M. pH = -log(10⁻³) = 3.',
      },
      {
        q: 'Which intermolecular force is strongest in liquid water (H₂O)?',
        options: ['London dispersion forces', 'Dipole-dipole only', 'Hydrogen bonding', 'Ionic bonding'],
        correct: 2,
        explanation: 'Hydrogen bonds between O and H provide high boiling point and surface tension.',
      },
    ],
    cheatSheet: [
      'Ideal Gas Law: PV = nRT (R = 0.08206 L·atm/(mol·K))',
      'pH & pOH: pH = -log[H⁺], pH + pOH = 14',
      'Molarity: M = moles of solute / liters of solution',
      'Calorimetry: q = mcΔT',
    ],
  },
};

export default function ExamCramApp() {
  const [selectedExamKey, setSelectedExamKey] = useState('sat-math');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DATA['sat-math'].timeLimit);
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'cheat'

  const exam = EXAM_DATA[selectedExamKey];
  const currentQuestion = exam.questions[currentQIndex];

  // Timer countdown
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, selectedExamKey]);

  const handleSelectAnswer = (idx) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQIndex]: idx,
    }));
  };

  const handleRestart = (newKey = selectedExamKey) => {
    setSelectedExamKey(newKey);
    setCurrentQIndex(0);
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft(EXAM_DATA[newKey].timeLimit);
  };

  // Calculate score
  const score = exam.questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correct ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((score / exam.questions.length) * 100);
  const passed = percentage >= 70;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Exam Cram & Passing Simulator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                Pass Guarantee
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Timed practice tests with instant 70%+ pass verdict, step explanations & formula sheets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timed Test
            </button>
            <button
              onClick={() => setActiveTab('cheat')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'cheat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cheat Sheets
            </button>
          </div>

          <button
            onClick={() => openAboutBlankCloak(window.location.href, 'mission-cisd')}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in about:blank</span>
          </button>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2 flex items-center space-x-2 overflow-x-auto select-none">
        {Object.entries(EXAM_DATA).map(([key, data]) => (
          <button
            key={key}
            onClick={() => handleRestart(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedExamKey === key
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {data.title}
          </button>
        ))}
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
        {activeTab === 'cheat' ? (
          /* Formula Cheat Sheet View */
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>{exam.title} - High-Yield Exam Formulas</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Review these high-yield rules right before your exam to ensure maximum recall.
              </p>

              <div className="space-y-2.5">
                {exam.cheatSheet.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-950 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !submitted ? (
          /* Live Quiz In-Progress View */
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Top Bar: Progress & Timer */}
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300">
                  Question {currentQIndex + 1} of {exam.questions.length}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-400 font-medium">
                  {Object.keys(userAnswers).length} answered
                </span>
              </div>

              <div className="flex items-center space-x-1.5 font-mono text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white leading-relaxed">
                {currentQuestion.q}
              </h3>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[currentQIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectAnswer(oIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center space-x-3 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/50 text-white font-medium shadow-xs'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Previous
              </button>

              {currentQIndex < exam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  Submit & Grade Exam
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results & Score Screen */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className={`p-6 rounded-2xl border text-center space-y-4 shadow-xl ${
              passed
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-red-950/30 border-red-500/40'
            }`}>
              <div className="inline-block p-4 rounded-full bg-slate-900 border border-slate-800 shadow-md">
                {passed ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
              </div>

              <div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {passed ? 'PASSED (70%+ Threshold Met)' : 'NEEDS PRACTICE (<70%)'}
                </span>
                <h3 className="text-3xl font-black text-white mt-2">
                  {percentage}% ({score} / {exam.questions.length})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {passed
                    ? 'Outstanding! You have mastered the core concepts required to pass this exam.'
                    : 'Review the step explanations below and retry to lock in the passing grade.'}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleRestart()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Practice Exam</span>
                </button>
              </div>
            </div>

            {/* Question by question explanation breakdown */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider">
                Question Breakdown & Explanations
              </h4>
              {exam.questions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.correct;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-white">Q{idx + 1}. {q.q}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ml-2 ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="text-slate-400 text-[11px] space-y-1">
                      <p>
                        Your Answer:{' '}
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {userChoice !== undefined ? q.options[userChoice] : 'None'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          Correct Answer:{' '}
                          <span className="text-emerald-400 font-bold">{q.options[q.correct]}</span>
                        </p>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong className="text-indigo-400">Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
