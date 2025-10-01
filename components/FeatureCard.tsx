
import React from 'react';
import type { LucideProps } from 'lucide-react';
import { PipelineState } from '../types';
import Spinner from './ui/Spinner';
import { CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: React.ComponentType<LucideProps>;
  status: PipelineState;
  onClick: () => void;
  resultAvailable: boolean;
}

const StatusIndicator: React.FC<{ status: PipelineState }> = ({ status }) => {
  switch (status) {
    case 'running':
      return <div className="flex items-center gap-2 text-sm text-cyan-300"><Spinner /> <span>قيد التجهيز...</span></div>;
    case 'complete':
      return <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle size={16} /> <span>اكتمل</span></div>;
    case 'error':
      return <div className="flex items-center gap-2 text-sm text-red-400"><AlertCircle size={16} /> <span>حدث خطأ</span></div>;
    default:
      return <div className="text-sm text-slate-400"><span>في الانتظار</span></div>;
  }
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, Icon, description, status, onClick, resultAvailable }) => {
  const isEnabled = status === 'complete' && resultAvailable;

  return (
    <div className={`
      bg-slate-800/40 border border-slate-700 rounded-xl p-6 flex flex-col justify-between 
      transition-all duration-300 backdrop-blur-sm
      ${isEnabled ? 'hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-900/40' : ''}
    `}>
      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <Icon className="text-purple-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4 h-10">{description}</p>
        <div className="h-6">
            <StatusIndicator status={status} />
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={!isEnabled}
        className="w-full mt-4 px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors
                   disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed
                   hover:enabled:bg-purple-600 hover:enabled:text-white flex items-center justify-center gap-2"
      >
        <Eye size={16} />
        عرض النتائج
      </button>
    </div>
  );
};

export default FeatureCard;
