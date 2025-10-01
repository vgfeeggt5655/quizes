
import React from 'react';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="py-4 px-8 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          PDF <span className="text-purple-400">Power-Up</span>
        </h1>
        {showReset && (
             <button
             onClick={onReset}
             className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors text-sm"
           >
             ابدأ من جديد
           </button>
        )}
      </div>
    </header>
  );
};

export default Header;
