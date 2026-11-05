import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Hash, 
  Volume2, 
  Mic, 
  MicOff, 
  Headphones, 
  Settings, 
  Plus, 
  Compass, 
  Send, 
  Smile, 
  Paperclip, 
  Gift, 
  Bell, 
  Pin, 
  Users, 
  Search, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  Check, 
  Flame,
  Award
} from 'lucide-react';

// Web Audio sound synthesizer for Discord UI sounds
const playDiscordSound = (type = 'message') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'message') {
      // Classic Discord incoming message notification: two quick friendly sine beeps
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'join') {
      // User join voice
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'leave') {
      // User leave voice
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'mute') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    // Audio gesture safeguard
  }
};

const INITIAL_SERVERS = [
  { id: 'mateo', name: "Mateo's Gaming Lounge", icon: '🎮', unread: 3, active: true },
  { id: 'homework', name: 'Homework & Exam Answers', icon: '📚', unread: 0, active: false },
  { id: 'brainrot', name: 'TikTok & Brainrot Memes', icon: '🍿', unread: 5, active: false },
  { id: 'lofi', name: 'Chill & Lo-Fi Study', icon: '🎵', unread: 0, active: false },
];

const INITIAL_CHANNELS = {
  mateo: [
    { id: 'general', name: 'general-chat', type: 'text' },
    { id: 'gaming', name: 'roblox-and-fortnite', type: 'text' },
    { id: 'unblocked', name: 'unblocked-games', type: 'text' },
    { id: 'voice-main', name: 'Squad Voice Lounge', type: 'voice', users: ['Mateo', 'Alex_09', 'Speedy'] },
    { id: 'voice-chill', name: 'Quiet Study Chill', type: 'voice', users: ['Sarah_K'] },
  ],
  homework: [
    { id: 'math-answers', name: 'algebra-and-geometry', type: 'text' },
    { id: 'biology', name: 'biology-quiz-prep', type: 'text' },
    { id: 'english', name: 'essay-helpers', type: 'text' },
    { id: 'voice-study', name: 'Silent Study Group', type: 'voice', users: ['Tutor_AI'] },
  ],
  brainrot: [
    { id: 'tiktok-clips', name: 'tiktok-reposts', type: 'text' },
    { id: 'skibidi-memes', name: 'memes-and-brainrot', type: 'text' },
    { id: 'soundboard', name: 'vine-booms', type: 'text' },
  ],
  lofi: [
    { id: 'music-recs', name: 'song-recommendations', type: 'text' },
    { id: 'lofi-stream', name: '24-7-lofi-radio', type: 'voice', users: ['LofiBot'] },
  ]
};

const INITIAL_MESSAGES = {
  general: [
    { id: '1', user: 'Mateo', avatar: '👑', color: 'text-amber-400', time: 'Today at 2:14 PM', text: "Welcome to Mateo's Learning Discord! Unblocked chat and games ready for class 😎", isMe: false },
    { id: '2', user: 'Gamer_Kyle', avatar: '🎮', color: 'text-emerald-400', time: 'Today at 2:15 PM', text: "Did you beat level 3 on Atari Breakout yet? That ball gets insane fast haha", isMe: false },
    { id: '3', user: 'Sophia_Dev', avatar: '🚀', color: 'text-indigo-400', time: 'Today at 2:16 PM', text: "The Google Search in the navigator works so fast too, teachers thought I was doing research 💀", isMe: false },
    { id: '4', user: 'Bot_Mateo', avatar: '🤖', color: 'text-pink-400', time: 'Today at 2:17 PM', text: "PRO TIP: Press Esc anytime to activate the Mission CISD disguise overlay!", isBot: true },
  ],
  'roblox-and-fortnite': [
    { id: 'r1', user: 'Mateo', avatar: '👑', color: 'text-amber-400', time: 'Today at 1:40 PM', text: "Who wants to hop on after school? Drop your tags below 👇", isMe: false },
    { id: 'r2', user: 'Shadow_Ninja', avatar: '🥷', color: 'text-cyan-400', time: 'Today at 1:45 PM', text: "I'm down! Just finishing this physics worksheet in 5 mins", isMe: false }
  ],
  'unblocked-games': [
    { id: 'u1', user: 'ArcadeMaster', avatar: '🕹️', color: 'text-emerald-400', time: 'Today at 2:01 PM', text: "The new Atari Breakout and Space Invaders on this portal are 10/10 no lag at all!", isMe: false }
  ],
  'algebra-and-geometry': [
    { id: 'm1', user: 'MathHelper_Bot', avatar: '📐', color: 'text-blue-400', time: 'Today at 11:30 AM', text: "Reminder: Quadratic formula is x = (-b ± √(b² - 4ac)) / (2a)", isBot: true }
  ],
  'tiktok-reposts': [
    { id: 't1', user: 'SubwaySurferFan', avatar: '🛹', color: 'text-pink-400', time: 'Today at 12:15 PM', text: "The split screen Subway Surfers + TikTok player is unmatched entertainment during homeroom", isMe: false }
  ]
};

export const DiscordApp = ({ onTriggerPanic }) => {
  const [activeServer, setActiveServer] = useState('mateo');
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [inVoice, setInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const messagesEndRef = useRef(null);

  const currentChannelList = INITIAL_CHANNELS[activeServer] || [];
  const currentMessages = messages[activeChannel] || [
    { id: 'welcome', user: 'Discord System', avatar: '💬', color: 'text-indigo-400', time: 'Just now', text: `Welcome to the beginning of #${activeChannel}! Send a message to chat with classmates.`, isBot: true }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      user: 'You (Student)',
      avatar: '🌟',
      color: 'text-cyan-300',
      time: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
      isMe: true
    };

    const targetChan = activeChannel;
    setMessages(prev => ({
      ...prev,
      [targetChan]: [...(prev[targetChan] || []), userMsg]
    }));

    playDiscordSound('message');
    setInputText('');

    // Trigger realistic AI bot response after 1.5 - 2.5 seconds
    setTimeout(() => {
      const botReplies = [
        "Facts! Mateo's Learning is definitely the cleanest portal this school year 🔥",
        "W text, did you check out the new games in the Arcade tab yet?",
        "Real! Don't forget you can hit Esc if the teacher walks around 👀",
        "100%! The sound effects and Google navigator are working great too."
      ];
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];

      const replyMsg = {
        id: (Date.now() + 1).toString(),
        user: 'MateoBot',
        avatar: '🤖',
        color: 'text-amber-400',
        time: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: randomReply,
        isBot: true
      };

      setMessages(prev => ({
        ...prev,
        [targetChan]: [...(prev[targetChan] || []), replyMsg]
      }));

      playDiscordSound('message');
    }, 1800);
  };

  const handleToggleVoice = () => {
    if (!inVoice) {
      setInVoice(true);
      playDiscordSound('join');
    } else {
      setInVoice(false);
      playDiscordSound('leave');
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    playDiscordSound('mute');
  };

  const handleOpenOfficialDiscord = () => {
    window.open('https://discord.com/app', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#313338] text-[#dbdee1] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[780px] max-w-6xl mx-auto font-sans">
      {/* Top Header Bar */}
      <div className="bg-[#1e1f22] px-4 py-2.5 border-b border-[#232428] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shadow-md shadow-[#5865F2]/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Discord Web & Mateo's Student Lounge
              </h2>
              <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30 px-1.5 py-0.5 rounded font-bold uppercase">
                Active Chat
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive school server, voice lounge, direct messaging, and unblocked Discord web
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Panic Escape */}
          <button
            onClick={onTriggerPanic}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Instant Disguise as Mission CISD (Esc)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Panic [Esc]</span>
          </button>

          {/* Launch Official Discord Web */}
          <button
            onClick={handleOpenOfficialDiscord}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-[#5865F2]/30 cursor-pointer"
            title="Open Official Discord Web in New Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Discord.com</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Discord Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Server Guild List (Icon column) */}
        <div className="w-[68px] bg-[#1e1f22] py-3 flex flex-col items-center gap-2 shrink-0 border-r border-[#232428] select-none">
          {/* Home Discord Button */}
          <button 
            onClick={() => setActiveServer('mateo')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-200 cursor-pointer relative ${
              activeServer === 'mateo'
                ? 'bg-[#5865F2] text-white rounded-2xl shadow-lg shadow-[#5865F2]/40'
                : 'bg-[#313338] text-[#dbdee1] hover:bg-[#5865F2] hover:text-white hover:rounded-2xl rounded-3xl'
            }`}
            title="Mateo's Gaming Lounge"
          >
            {activeServer === 'mateo' && (
              <span className="absolute -left-1 w-1.5 h-10 bg-white rounded-r-full" />
            )}
            👑
          </button>

          <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

          {/* Other Servers */}
          {INITIAL_SERVERS.map((srv) => (
            <button
              key={srv.id}
              onClick={() => {
                setActiveServer(srv.id);
                const firstChan = INITIAL_CHANNELS[srv.id]?.[0]?.id || 'general';
                setActiveChannel(firstChan);
              }}
              className={`w-12 h-12 flex items-center justify-center text-xl transition-all duration-200 cursor-pointer relative ${
                activeServer === srv.id
                  ? 'bg-[#5865F2] text-white rounded-2xl shadow-lg shadow-[#5865F2]/40'
                  : 'bg-[#313338] text-[#dbdee1] hover:bg-[#35373c] hover:rounded-2xl rounded-3xl'
              }`}
              title={srv.name}
            >
              {activeServer === srv.id && (
                <span className="absolute -left-1 w-1.5 h-10 bg-white rounded-r-full" />
              )}
              <span>{srv.icon}</span>
              {srv.unread > 0 && activeServer !== srv.id && (
                <span className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {srv.unread}
                </span>
              )}
            </button>
          ))}

          {/* Add Server Button */}
          <button 
            onClick={() => alert("Server Discovery: Explore Mateo's custom school servers or connect to your own Discord at discord.com/app!")}
            className="w-12 h-12 bg-[#313338] hover:bg-[#23a55a] text-[#23a55a] hover:text-white rounded-3xl hover:rounded-2xl flex items-center justify-center transition-all cursor-pointer mt-1"
            title="Add a Server"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Column 2: Channels List & User Voice Bar */}
        <div className="w-60 bg-[#2b2d31] flex flex-col shrink-0 border-r border-[#232428] select-none">
          {/* Server Title Header */}
          <div className="h-12 border-b border-[#1f2023] px-4 flex items-center justify-between font-bold text-white text-sm shadow-xs">
            <span className="truncate">
              {INITIAL_SERVERS.find(s => s.id === activeServer)?.name || "Mateo's Lounge"}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
          </div>

          {/* Channels Scroll Area */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Text Channels Group */}
            <div>
              <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-[#949ba4]">
                Text Channels
              </span>
              <div className="mt-1 space-y-0.5">
                {currentChannelList.filter(c => c.type === 'text').map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannel(chan.id)}
                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      activeChannel === chan.id
                        ? 'bg-[#35373c] text-white font-semibold'
                        : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                    }`}
                  >
                    <Hash className="w-4 h-4 text-[#80848e] shrink-0" />
                    <span className="truncate">{chan.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Channels Group */}
            <div>
              <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-[#949ba4]">
                Voice Channels
              </span>
              <div className="mt-1 space-y-1">
                {currentChannelList.filter(c => c.type === 'voice').map((chan) => (
                  <div key={chan.id} className="space-y-1">
                    <button
                      onClick={handleToggleVoice}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        inVoice
                          ? 'bg-[#23a55a]/20 text-[#23a55a] font-semibold border border-[#23a55a]/30'
                          : 'text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Volume2 className={`w-4 h-4 ${inVoice ? 'text-[#23a55a] animate-pulse' : 'text-[#80848e]'} shrink-0`} />
                        <span className="truncate">{chan.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {inVoice ? 'Connected' : 'Join'}
                      </span>
                    </button>

                    {/* Active Voice Users */}
                    <div className="pl-6 space-y-1">
                      {chan.users?.map((u, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#949ba4]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#23a55a]"></span>
                          <span>{u}</span>
                        </div>
                      ))}
                      {inVoice && (
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                          <span>You (Speaking)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Account / Voice Status Bar */}
          <div className="bg-[#232428] p-2 flex items-center justify-between border-t border-[#1f2023] shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                  M
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#23a55a] border-2 border-[#232428] rounded-full"></span>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white truncate block">Mateo</span>
                <span className="text-[10px] text-[#949ba4] block truncate">Online · Unblocked</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#b5bac1]">
              <button
                onClick={handleToggleMute}
                className={`p-1.5 rounded hover:bg-[#35373c] hover:text-white cursor-pointer ${
                  isMuted ? 'text-rose-400 bg-rose-500/10' : ''
                }`}
                title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsDeafened(!isDeafened);
                  playDiscordSound('mute');
                }}
                className={`p-1.5 rounded hover:bg-[#35373c] hover:text-white cursor-pointer ${
                  isDeafened ? 'text-rose-400 bg-rose-500/10' : ''
                }`}
                title="Deafen Audio"
              >
                <Headphones className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Active Chat Room */}
        <div className="flex-1 bg-[#313338] flex flex-col min-w-0">
          {/* Channel Top Header */}
          <div className="h-12 border-b border-[#232428] px-4 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#80848e]" />
              <span className="font-bold text-white text-sm">{activeChannel}</span>
              <span className="text-xs text-[#949ba4] hidden md:inline ml-2 border-l border-[#3f4147] pl-3">
                Mateo's school chat lounge & homework answers
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#b5bac1]">
              <button 
                onClick={() => playDiscordSound('message')}
                className="hover:text-white p-1" 
                title="Test Discord Ping"
              >
                <Bell className="w-4 h-4" />
              </button>
              <button 
                onClick={handleOpenOfficialDiscord}
                className="hover:text-white p-1 text-xs font-semibold flex items-center gap-1 text-[#5865F2]"
                title="Open Web App"
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Discord Web</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((msg) => (
              <div 
                key={msg.id} 
                className="flex items-start gap-3 hover:bg-[#2e3035]/60 -mx-4 px-4 py-1.5 rounded transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-[#1e1f22] border border-[#2b2d31] flex items-center justify-center text-lg shrink-0 select-none shadow-sm">
                  {msg.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-sm font-bold ${msg.color || 'text-white'}`}>
                      {msg.user}
                    </span>
                    {msg.isBot && (
                      <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1 rounded uppercase">
                        BOT
                      </span>
                    )}
                    <span className="text-[10px] text-[#949ba4]">{msg.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#dbdee1] leading-relaxed break-words mt-0.5 select-text">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <div className="p-3 sm:p-4 bg-[#313338] shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="bg-[#383a40] rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:ring-1 focus-within:ring-[#5865F2]"
            >
              <div className="p-1 rounded-full bg-[#4e5058] text-[#dbdee1] hover:text-white cursor-pointer shrink-0">
                <Plus className="w-4 h-4" />
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${activeChannel}... (Type here and press Enter!)`}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-[#80848e] outline-none"
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-1.5 bg-[#5865F2] disabled:opacity-40 hover:bg-[#4752c4] text-white rounded-lg transition-colors cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
