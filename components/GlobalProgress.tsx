
import React from 'react';

interface GlobalProgressProps {
  progress: number;
}

const GlobalProgress: React.FC<GlobalProgressProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-1">
            <span className="text-base font-medium text-purple-300">التقدم الإجمالي</span>
            <span className="text-sm font-medium text-purple-300">{Math.round(progress)}%</span>
        </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GlobalProgress;
