
import { useState, useEffect, useRef, useCallback } from 'react';

const useAudioPlayer = (text: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!text) return;

    const u = new SpeechSynthesisUtterance(text);
    // Find an Arabic voice
    const voices = synth.getVoices();
    const arabicVoice = voices.find(voice => voice.lang.startsWith('ar'));
    if(arabicVoice) {
        u.voice = arabicVoice;
    }
    u.lang = 'ar-SA';
    u.rate = playbackRate;
    u.volume = isMuted ? 0 : 1;
    
    u.onstart = () => setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
    u.onpause = () => setIsPlaying(false);
    u.onresume = () => setIsPlaying(true);
    
    utteranceRef.current = u;
    
    return () => {
      synth.cancel();
    };
  }, [text]);

  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.rate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  const play = useCallback(() => {
    const synth = window.speechSynthesis;
    if (utteranceRef.current) {
      if (synth.paused) {
        synth.resume();
      } else {
        synth.speak(utteranceRef.current);
      }
    }
  }, []);

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.pause();
  }, []);
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const cleanup = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.pending || synth.paused) {
      synth.cancel();
    }
    setIsPlaying(false);
  }, []);

  return { isPlaying, isMuted, playbackRate, play, pause, toggleMute, setPlaybackRate, cleanup };
};

export default useAudioPlayer;
