
import React, { useState, useCallback, useMemo } from 'react';
import { AppState, PipelineStatus, Results, Flashcard, MCQ, PipelineKey } from './types';
import Header from './components/Header';
import Uploader from './components/Uploader';
import Dashboard from './components/Dashboard';
import GlobalProgress from './components/GlobalProgress';
import SummaryDialog from './components/dialogs/SummaryDialog';
import MCQDialog from './components/dialogs/MCQDialog';
import FlashcardDialog from './components/dialogs/FlashcardDialog';
import PodcastDialog from './components/dialogs/PodcastDialog';
import { generateMCQs, generateFlashcardsStream, generateSummary, generatePodcastScript } from './services/geminiService';

const initialResults: Results = {
  summary: null,
  mcqs: [],
  flashcards: [],
  podcastScript: null,
};

const initialStatus: PipelineStatus = {
  summary: 'pending',
  mcqs: 'pending',
  flashcards: 'pending',
  podcast: 'pending',
};

function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>(initialStatus);
  const [results, setResults] = useState<Results>(initialResults);
  const [error, setError] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<PipelineKey | null>(null);

  const startProcessing = useCallback(async (text: string) => {
    setAppState('processing');
    setPipelineStatus(initialStatus);
    setResults(initialResults);
    setError(null);

    const updateStatus = (key: PipelineKey, status: 'running' | 'complete' | 'error') => {
      setPipelineStatus(prev => ({ ...prev, [key]: status }));
    };

    try {
      const promises = [
        // Summary
        (async () => {
          updateStatus('summary', 'running');
          const summary = await generateSummary(text);
          setResults(prev => ({ ...prev, summary }));
          updateStatus('summary', 'complete');
        })(),

        // MCQs
        (async () => {
          updateStatus('mcqs', 'running');
          const mcqs = await generateMCQs(text);
          setResults(prev => ({ ...prev, mcqs }));
          updateStatus('mcqs', 'complete');
        })(),

        // Podcast Script
        (async () => {
          updateStatus('podcast', 'running');
          const script = await generatePodcastScript(text);
          setResults(prev => ({ ...prev, podcastScript: script }));
          updateStatus('podcast', 'complete');
        })(),

        // Flashcards (Streaming)
        (async () => {
          updateStatus('flashcards', 'running');
          await generateFlashcardsStream(text, (newCard) => {
            setResults(prev => ({ ...prev, flashcards: [...prev.flashcards, newCard] }));
          });
          updateStatus('flashcards', 'complete');
        })(),
      ];

      const outcomes = await Promise.allSettled(promises);
      
      let hasError = false;
      outcomes.forEach((outcome, index) => {
        if (outcome.status === 'rejected') {
          hasError = true;
          const key = ['summary', 'mcqs', 'podcast', 'flashcards'][index] as PipelineKey;
          updateStatus(key, 'error');
          console.error(`Error in ${key} pipeline:`, outcome.reason);
        }
      });

      if (hasError) {
         setError("One or more tasks failed. Please check the console for details.");
      }
      setAppState('complete');
    } catch (e) {
      console.error("A critical error occurred:", e);
      setError("A critical error occurred during processing.");
      setAppState('error');
    }
  }, []);

  const progress = useMemo(() => {
    const completed = Object.values(pipelineStatus).filter(s => s === 'complete').length;
    return (completed / 4) * 100;
  }, [pipelineStatus]);
  
  const resetApp = () => {
    setAppState('idle');
    setPipelineStatus(initialStatus);
    setResults(initialResults);
    setError(null);
    setActiveDialog(null);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
       <div 
        className="absolute inset-0 z-0 opacity-20 [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--purple-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [background-image:var(--aurora)] [background-size:200%_200%] [animation:aurora_60s_linear_infinite] after:absolute after:inset-0 after:bg-slate-900 after:mix-blend-difference"
      ></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onReset={resetApp} showReset={appState !== 'idle'}/>
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          {appState === 'idle' && <Uploader onStart={startProcessing} />}
          
          {(appState === 'processing' || appState === 'complete' || appState === 'error') && (
            <div className="w-full">
              <GlobalProgress progress={progress} />
              <Dashboard 
                status={pipelineStatus} 
                onOpenDialog={setActiveDialog}
                hasResults={results}
              />
              {error && <p className="text-center text-red-400 mt-4">{error}</p>}
            </div>
          )}
        </main>
      </div>

      <SummaryDialog 
        isOpen={activeDialog === 'summary'} 
        onClose={() => setActiveDialog(null)}
        summary={results.summary}
      />
      <MCQDialog
        isOpen={activeDialog === 'mcqs'}
        onClose={() => setActiveDialog(null)}
        mcqs={results.mcqs}
      />
      <FlashcardDialog
        isOpen={activeDialog === 'flashcards'}
        onClose={() => setActiveDialog(null)}
        flashcards={results.flashcards}
      />
       <PodcastDialog
        isOpen={activeDialog === 'podcast'}
        onClose={() => setActiveDialog(null)}
        script={results.podcastScript}
      />
    </div>
  );
}

export default App;
