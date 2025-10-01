
export type AppState = 'idle' | 'processing' | 'complete' | 'error';
export type PipelineState = 'pending' | 'running' | 'complete' | 'error';

export interface PipelineStatus {
  summary: PipelineState;
  mcqs: PipelineState;
  flashcards: PipelineState;
  podcast: PipelineState;
}

export type PipelineKey = keyof PipelineStatus;

export interface MCQ {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface Results {
  summary: string | null;
  mcqs: MCQ[];
  flashcards: Flashcard[];
  podcastScript: string | null;
}
