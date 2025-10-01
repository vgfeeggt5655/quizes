
import React, { useState } from 'react';
import Dialog from '../ui/Dialog';
import { MCQ } from '../../types';
import { Check, X } from 'lucide-react';

interface MCQDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mcqs: MCQ[];
}

const MCQDialog: React.FC<MCQDialogProps> = ({ isOpen, onClose, mcqs }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // End of quiz
      onClose(); // Or show a summary screen
    }
  };
  
  const reset = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
  }

  const currentQuestion = mcqs[currentQuestionIndex];

  return (
    <Dialog isOpen={isOpen} onClose={() => { reset(); onClose(); }} title={`سؤال ${currentQuestionIndex + 1} من ${mcqs.length}`}>
      {mcqs.length > 0 && currentQuestion ? (
        <div>
          <h3 className="text-xl mb-6 font-semibold">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswerIndex;
              const isSelected = index === selectedAnswer;
              
              let buttonClass = "w-full text-right p-4 rounded-lg border-2 transition-all duration-300 ";
              if (showResult) {
                if (isCorrect) {
                  buttonClass += "bg-green-500/20 border-green-500";
                } else if (isSelected && !isCorrect) {
                  buttonClass += "bg-red-500/20 border-red-500";
                } else {
                   buttonClass += "border-slate-600 bg-slate-800";
                }
              } else {
                buttonClass += "border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-purple-500";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && <Check className="text-green-400" />}
                    {showResult && isSelected && !isCorrect && <X className="text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>
          {showResult && (
             <div className="mt-6 p-4 bg-slate-800/70 rounded-lg border border-slate-700">
                <h4 className="font-bold text-purple-400 mb-2">شرح الإجابة:</h4>
                <p className="text-slate-300">{currentQuestion.explanation}</p>
             </div>
          )}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
            >
              {currentQuestionIndex < mcqs.length - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-400">جاري إنشاء الأسئلة...</p>
      )}
    </Dialog>
  );
};

export default MCQDialog;
