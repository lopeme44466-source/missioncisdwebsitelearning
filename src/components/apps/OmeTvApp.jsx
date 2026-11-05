import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, SkipForward, Send, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { openAboutBlankCloak } from '../../utils/cloak';

const SIMULATED_STRANGERS = [
  { id: 1, name: 'Lucas', location: 'Austin, Texas', grade: 'High School Junior', quote: 'Studying for AP Chem test tomorrow... stoichiometry is tough!' },
  { id: 2, name: 'Sophia', location: 'London, UK', grade: 'Year 12 Student', quote: 'Reviewing calculus integrals with lofi beats in the background.' },
  { id: 3, name: 'Kenji', location: 'Tokyo, Japan', grade: 'High School Senior', quote: 'Taking a 5-minute break from physics problem set!' },
  { id: 4, name: 'Elena', location: 'Madrid, Spain', grade: 'Biology Major Prep', quote: 'Practicing flashcards for cellular respiration exam.' },
];

export default function OmeTvApp() {
  const [strangerIndex, setStrangerIndex] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'System', text: 'You are now connected with a student peer. Say hi!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const currentStranger = SIMULATED_STRANGERS[strangerIndex];

  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err) {
        alert('Webcam preview unavailable or permission denied.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const nextStranger = () => {
    setStrangerIndex((prev) => (prev + 1) % SIMULATED_STRANGERS.length);
    setMessages([
      { sender: 'System', text: `Connected to ${SIMULATED_STRANGERS[(strangerIndex + 1) % SIMULATED_STRANGERS.length].name} from ${SIMULATED_STRANGERS[(strangerIndex + 1) % SIMULATED_STRANGERS.length].location}.` },
    ]);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setMessages((prev) => [...prev, { sender: 'You', text }]);
    setChatInput('');

    // Stranger reply simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: currentStranger.name, text: `Nice! ${currentStranger.quote}` },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>OmeTV Video Connect Simulator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold uppercase">
                Student Network
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Simulated safe peer video study chat and official ome.tv launcher
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAboutBlankCloak('https://ome.tv/', 'mission-cisd')}
            className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Ome.tv in about:blank</span>
          </button>
        </div>
      </div>

      {/* Main Split Video Screen */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Stranger Video Box */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 relative min-h-[300px]">
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentStranger.name} ({currentStranger.location})
            </span>
            <span className="text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-300">
              {currentStranger.grade}
            </span>
          </div>

          {/* Stranger Avatar Screen */}
          <div className="my-auto text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white text-3xl font-black mx-auto flex items-center justify-center shadow-xl">
              {currentStranger.name[0]}
            </div>
            <p className="text-xs text-slate-300 italic max-w-xs mx-auto">
              "{currentStranger.quote}"
            </p>
          </div>

          <div className="flex justify-between items-center z-10">
            <button
              onClick={nextStranger}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition shadow-md"
            >
              <SkipForward className="w-4 h-4" />
              <span>Next Student [Skip]</span>
            </button>
          </div>
        </div>

        {/* Right: Your Webcam Box & Text Chat */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 relative min-h-[300px]">
          <div className="flex items-center justify-between z-10 mb-2">
            <span className="text-xs font-bold text-slate-300">You (Student Cam)</span>
            <button
              onClick={toggleCamera}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                cameraActive ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {cameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
              <span>{cameraActive ? 'Turn Off Cam' : 'Preview Cam'}</span>
            </button>
          </div>

          {/* Camera Viewfinder */}
          <div className="h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
            {cameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-slate-500">Camera preview off</span>
            )}
          </div>

          {/* Text Chat Messages */}
          <div className="h-28 overflow-y-auto custom-scrollbar bg-slate-950/60 rounded-xl p-2.5 mt-2 border border-slate-800 text-xs space-y-1">
            {messages.map((m, i) => (
              <p key={i}>
                <span className="font-bold text-cyan-400">{m.sender}: </span>
                <span className="text-slate-200">{m.text}</span>
              </p>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={sendMessage} className="flex gap-2 mt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message to student..."
              className="flex-1 bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none text-white focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
