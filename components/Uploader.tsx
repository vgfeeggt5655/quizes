
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface UploaderProps {
  onStart: (text: string) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onStart }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (text.trim().length < 100) {
      setError('الرجاء إدخال نص لا يقل عن 100 حرف لبدء التحليل.');
      return;
    }
    setError('');
    onStart(text);
  };

  return (
    <div className="w-full max-w-3xl text-center flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
        حوّل مستنداتك إلى أدوات تعلم تفاعلية
      </h2>
      <p className="text-lg text-slate-300 mb-8 max-w-2xl">
        الصق محتوى ملف الـ PDF الخاص بك هنا. سيقوم الذكاء الاصطناعي بإنشاء أسئلة، بطاقات تعليمية، ملخص، وبودكاست تعليمي بشكل فوري.
      </p>
      <div className="w-full bg-slate-800/50 rounded-lg p-1 border border-slate-700 backdrop-blur-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="الصق النص من ملف PDF هنا..."
          className="w-full h-64 bg-slate-900 text-slate-200 p-4 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder-slate-500"
        />
      </div>
      {error && <p className="text-red-400 mt-2">{error}</p>}
      <button
        onClick={handleStart}
        disabled={!text.trim()}
        className="mt-6 px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
      >
        <Sparkles size={20} />
        ابدأ التحليل
      </button>
    </div>
  );
};

export default Uploader;
