
import React, { useState } from 'react';
import Dialog from '../ui/Dialog';
import { Flashcard } from '../../types';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface FlashcardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
}

const FlashcardDialog: React.FC<FlashcardDialogProps> = ({ isOpen, onClose, flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const reset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };
  
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <Dialog isOpen={isOpen} onClose={() => { reset(); onClose(); }} title="البطاقات التعليمية">
      {flashcards.length > 0 && currentCard ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg h-80 perspective-1000 mb-6">
            <div
              className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-slate-800 border border-slate-600 rounded-xl cursor-pointer">
                <p className="text-2xl text-center font-bold text-white">{currentCard.term}</p>
              </div>
              <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-6 bg-purple-900/50 border border-purple-700 rounded-xl cursor-pointer">
                <p className="text-lg text-center text-slate-200">{currentCard.definition}</p>
              </div>
            </div>
          </div>
          <div className="text-slate-400 mb-6 flex items-center gap-2 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <RefreshCw size={16} />
            <span>اقلب البطاقة</span>
          </div>
          <div className="flex items-center justify-between w-full max-w-lg">
            <button onClick={handlePrev} className="p-3 bg-slate-700 rounded-full hover:bg-purple-600 transition-colors">
              <ArrowRight size={24} />
            </button>
            <span className="text-lg font-semibold">{currentIndex + 1} / {flashcards.length}</span>
            <button onClick={handleNext} className="p-3 bg-slate-700 rounded-full hover:bg-purple-600 transition-colors">
              <ArrowLeft size={24} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-400">جاري إنشاء البطاقات...</p>
      )}
    </Dialog>
  );
};

export default FlashcardDialog;
