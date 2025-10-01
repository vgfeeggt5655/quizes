
import React from 'react';
import Dialog from '../ui/Dialog';

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string | null;
}

const SummaryDialog: React.FC<SummaryDialogProps> = ({ isOpen, onClose, summary }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="الملخص الذكي">
      {summary ? (
        <div 
          className="prose prose-invert prose-p:text-slate-300 prose-headings:text-white prose-strong:text-purple-400 prose-ul:list-disc prose-li:marker:text-purple-400" 
          dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
        />
      ) : (
        <p className="text-slate-400">جاري إنشاء الملخص...</p>
      )}
    </Dialog>
  );
};

export default SummaryDialog;
