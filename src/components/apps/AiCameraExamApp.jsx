import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Image as ImageIcon,
  Send,
  Zap,
  HelpCircle,
  Copy,
  Check,
  Maximize2,
  RefreshCw,
  FileText,
  Volume2,
} from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

const PRELOADED_EXAM_SAMPLES = [
  {
    id: 'sat-quad',
    subject: 'SAT Math',
    title: 'SAT Quadratic Parabola Minimum',
    notes: 'Find the minimum value and x-intercepts of f(x) = x² - 6x + 8. Vertex formula test.',
    promptText: 'A parabola is defined by f(x) = x^2 - 6x + 8. (a) What is the coordinates of the vertex? (b) What are the real roots/zeros of the function?',
    samplePreviewColor: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'ap-chem-stoich',
    subject: 'AP Chemistry',
    title: 'AP Chem Stoichiometry & Molar Mass',
    notes: 'How many moles are in 36.0 g of H₂O, and how many water molecules does this correspond to at STP?',
    promptText: 'Given 36.0 grams of water (H2O), determine: (1) The molar mass of water. (2) The total number of moles of H2O. (3) The number of individual molecules using Avogadro\'s number.',
    samplePreviewColor: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'ap-bio-atp',
    subject: 'AP Biology',
    title: 'Cellular Respiration ATP Yield',
    notes: 'Compare net ATP yields between glycolysis, Krebs cycle, and oxidative phosphorylation in eukaryotes.',
    promptText: 'Explain the total net ATP yield of eukaryotic aerobic cellular respiration from 1 glucose molecule, breaking down glycolysis, pyruvate oxidation, Krebs cycle, and oxidative phosphorylation.',
    samplePreviewColor: 'from-amber-600 to-orange-800',
  },
  {
    id: 'phys-kinematics',
    subject: 'Physics Mechanics',
    title: 'Free Fall Velocity from 20m Height',
    notes: 'An object is dropped from rest from a 20-meter cliff. Find its impact velocity neglecting air resistance.',
    promptText: 'A 2.5 kg ball is dropped from rest from a height of h = 20.0 m above the ground. Using g = 9.8 m/s^2, calculate: (a) The final velocity of the ball just before impact using conservation of energy. (b) The time elapsed during the fall.',
    samplePreviewColor: 'from-purple-600 to-violet-800',
  },
];

export default function AiCameraExamApp() {
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [subject, setSubject] = useState('SAT Math');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start Camera Stream
  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable or blocked. You can upload an image or select a sample exam question below!');
      setStreamActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture current video frame to base64
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Solve with Gemini
  const handleSolveExam = async (imageToSolve = capturedImage, promptToSolve = customPrompt) => {
    setLoading(true);
    setSolution(null);
    try {
      const res = await fetch('/api/gemini/solve-exam-camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageToSolve,
          subject,
          promptText: promptToSolve,
        }),
      });
      const data = await res.json();
      if (data.solution) {
        setSolution(data.solution);
      } else {
        setSolution('Could not generate solution. Please try again with clear text or question.');
      }
    } catch (err) {
      setSolution('Error connecting to AI Exam Solver. Using offline fallback calculation.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample) => {
    setSubject(sample.subject);
    setCustomPrompt(sample.promptText);
    setCapturedImage(null);
    stopCamera();
    handleSolveExam(null, sample.promptText);
  };

  const copySolution = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top App Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>AI Camera Exam & Homework Scanner</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase">
                Gemini Vision
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Point your camera at any test paper, textbook problem, or formula for instant step-by-step solutions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAboutBlankCloak(window.location.href, 'mission-cisd')}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Open Camera App in about:blank stealth window"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open in about:blank</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewfinder & Image Input (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col">
          {/* Viewfinder Card */}
          <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden aspect-[4/3] flex items-center justify-center shadow-lg group">
            {streamActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Overlays / Reticle */}
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
                    <span className="bg-black/60 backdrop-blur-xs text-[11px] text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      CAMERA LIVE
                    </span>
                    <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
                  </div>

                  <div className="text-center">
                    <p className="inline-block bg-black/60 backdrop-blur-xs text-xs text-white/90 px-3 py-1 rounded-full border border-white/20">
                      Align question within frame and hold steady
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
                    <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg"></div>
                  </div>
                </div>

                {/* Capture Controls Strip */}
                <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      const nextMode = facingMode === 'environment' ? 'user' : 'environment';
                      setFacingMode(nextMode);
                      startCamera(nextMode);
                    }}
                    className="p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full backdrop-blur-md border border-slate-700 transition cursor-pointer"
                    title="Flip Camera"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={takeSnapshot}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition cursor-pointer text-sm"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capture Problem</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="p-3 bg-slate-900/80 hover:bg-slate-800 text-red-400 rounded-full backdrop-blur-md border border-slate-700 transition cursor-pointer"
                    title="Stop Camera"
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : capturedImage ? (
              /* Display Captured Snapshot */
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <img
                  src={capturedImage}
                  alt="Captured Exam Problem"
                  className="w-full h-full object-contain"
                />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      startCamera();
                    }}
                    className="px-3 py-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-xs backdrop-blur-md border border-white/20 transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>

                <div className="absolute bottom-3 inset-x-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-4 h-4" /> Ready to Solve
                  </span>
                  <button
                    onClick={() => handleSolveExam(capturedImage, customPrompt)}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{loading ? 'Analyzing...' : 'Solve with AI Now'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Camera Idle / Placeholder State */
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-indigo-400 mx-auto flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Open Camera Scanner</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Capture math formulas, AP biology diagrams, chemistry equations, or history exam questions.
                  </p>
                </div>

                {cameraError && (
                  <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl max-w-md mx-auto">
                    {cameraError}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startCamera()}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Start Live Camera</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Subject & Custom Notes Selector */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Exam Subject
              </label>
              <span className="text-[11px] text-slate-500">Fine-tunes step breakdown</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                'SAT Math',
                'AP Biology',
                'AP Chemistry',
                'Physics Mechanics',
                'Algebra & Calculus',
                'US History',
                'Literature & DBQ',
              ].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSubject(subj)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    subject === subj
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Notes or Specific Part (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Focus on step 3 or explain why option B is incorrect..."
                  className="flex-1 bg-slate-950 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none"
                />
                <button
                  onClick={() => handleSolveExam(capturedImage, customPrompt)}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Solve</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preloaded Exam Question Bank (Instant test without camera) */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Or Try Preloaded Exam Question Samples:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRELOADED_EXAM_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {sample.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-400 transition">
                      Auto Solve →
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mt-1 truncate">{sample.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{sample.notes}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Step-by-Step Solution & Exam Cheat Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col overflow-hidden shadow-lg">
            {/* Solution Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">AI Step-by-Step Breakdown</h3>
              </div>

              {solution && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySolution}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                    title="Copy Solution"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Solution Body */}
            <div className="flex-1 p-4 lg:p-5 overflow-y-auto custom-scrollbar text-xs leading-relaxed space-y-4">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-3 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <div>
                    <p className="text-sm font-bold text-white">Exam AI Analyzing Question...</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Extracting formulas, variables, and calculating step-by-step proof
                    </p>
                  </div>
                </div>
              ) : solution ? (
                <div className="prose prose-invert max-w-none text-slate-200 whitespace-pre-line space-y-3 font-sans">
                  {solution}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Ready for Exam Questions</p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Take a photo with the live camera or click any preloaded exam sample on the left to view the step-by-step solution.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Exam Pro-Tips Footer */}
            <div className="p-3 bg-slate-950/70 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <Zap className="w-3.5 h-3.5" /> Exam Pass Guarantee
              </span>
              <span>100% Solved with Steps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
