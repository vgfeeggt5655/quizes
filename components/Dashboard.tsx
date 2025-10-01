
import React from 'react';
import { PipelineStatus, PipelineKey, Results } from '../types';
import FeatureCard from './FeatureCard';
import { BookOpen, HelpCircle, Layers, Mic } from 'lucide-react';

interface DashboardProps {
  status: PipelineStatus;
  onOpenDialog: (key: PipelineKey) => void;
  hasResults: Results;
}

const featureConfig = [
  { key: 'summary' as PipelineKey, title: 'الملخص الذكي', icon: BookOpen, description: 'ملخص شامل لأهم نقاط المستند.' },
  { key: 'mcqs' as PipelineKey, title: 'أسئلة الاختيار من متعدد', icon: HelpCircle, description: 'اختبر فهمك بأسئلة دقيقة.' },
  { key: 'flashcards' as PipelineKey, title: 'البطاقات التعليمية', icon: Layers, description: 'بطاقات للمراجعة السريعة للمصطلحات.' },
  { key: 'podcast' as PipelineKey, title: 'البودكاست التعليمي', icon: Mic, description: 'شرح صوتي تفاعلي للمحتوى.' },
];

const Dashboard: React.FC<DashboardProps> = ({ status, onOpenDialog, hasResults }) => {
  const isResultAvailable = (key: PipelineKey) => {
    switch (key) {
        case 'summary': return !!hasResults.summary;
        case 'mcqs': return hasResults.mcqs.length > 0;
        case 'flashcards': return hasResults.flashcards.length > 0;
        case 'podcast': return !!hasResults.podcastScript;
        default: return false;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {featureConfig.map(({ key, title, icon, description }) => (
        <FeatureCard
          key={key}
          title={title}
          Icon={icon}
          description={description}
          status={status[key]}
          onClick={() => onOpenDialog(key)}
          resultAvailable={isResultAvailable(key)}
        />
      ))}
    </div>
  );
};

export default Dashboard;
