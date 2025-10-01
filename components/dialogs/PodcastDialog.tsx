
import React from 'react';
import Dialog from '../ui/Dialog';
import useAudioPlayer from '../../hooks/useAudioPlayer';
import { Play, Pause, Volume2, VolumeX, Rewind, FastForward } from 'lucide-react';

interface PodcastDialogProps {
  isOpen: boolean;
  onClose: () => void;
  script: string | null;
}

const PodcastDialog: React.FC<PodcastDialogProps> = ({ isOpen, onClose, script }) => {
  const {
    isPlaying,
    isMuted,
    playbackRate,
    play,
    pause,
    toggleMute,
    setPlaybackRate,
    cleanup,
  } = useAudioPlayer(script || '');

  const handleClose = () => {
    cleanup();
    onClose();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="البودكاست التعليمي">
      {script ? (
        <div className="flex flex-col gap-6">
          <div className="w-full p-4 bg-slate-800/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700">
            <div className="flex items-center gap-4">
              <button onClick={handlePlayPause} className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <button onClick={toggleMute} className="p-2 text-slate-300 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">السرعة:</span>
                 {speedOptions.map(speed => (
                    <button 
                        key={speed}
                        onClick={() => setPlaybackRate(speed)}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${playbackRate === speed ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    >
                        {speed}x
                    </button>
                ))}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto p-4 bg-slate-800 rounded-lg border border-slate-700 prose prose-invert prose-p:text-slate-300">
             <p>{script}</p>
          </div>
        </div>
      ) : (
        <p className="text-slate-400">جاري إنشاء البودكاست...</p>
      )}
    </Dialog>
  );
};

export default PodcastDialog;
