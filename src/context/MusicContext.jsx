import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 'lofi-study',
    title: 'Rainy Night Lofi Study',
    artist: 'Chill Beats',
    genre: 'Lofi Hip Hop',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    fallbackSynth: true,
  },
  {
    id: 'synthwave-focus',
    title: 'Midnight Highway Synthwave',
    artist: 'Neon Drive',
    genre: 'Synthwave',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=synthwave-80s-110045.mp3',
    fallbackSynth: true,
  },
  {
    id: 'deep-ambient',
    title: 'Exam Concentration Waves',
    artist: 'Brain Flow',
    genre: 'Binaural Ambient',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    fallbackSynth: true,
  },
];

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const synthOscRef = useRef(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      audioRef.current.onerror = () => {
        // Fallback to pleasant synthetic chords
        playSyntheticChords();
      };
    }
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      playSyntheticChords();
      setIsPlaying(true);
    });
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSyntheticChords();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIdx);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = new Audio(TRACKS[nextIdx].url);
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      if (isPlaying) {
        audioRef.current.play().catch(() => playSyntheticChords());
      }
    }
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = new Audio(TRACKS[prevIdx].url);
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      if (isPlaying) {
        audioRef.current.play().catch(() => playSyntheticChords());
      }
    }
  };

  // Synthetic ambient chord generator in case network audio is restricted by school firewalls
  const playSyntheticChords = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Create soft chord
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
      osc2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      synthOscRef.current = { osc1, osc2, gain };
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const stopSyntheticChords = () => {
    if (synthOscRef.current) {
      try {
        synthOscRef.current.osc1.stop();
        synthOscRef.current.osc2.stop();
      } catch (e) {}
      synthOscRef.current = null;
    }
  };

  // Quick sound effect helper for games and clickers
  const playBeep = (freq = 440, type = 'sine', duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        currentTrackIndex,
        tracks: TRACKS,
        volume,
        setVolume,
        togglePlay,
        playAudio,
        pauseAudio,
        nextTrack,
        prevTrack,
        playBeep,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
