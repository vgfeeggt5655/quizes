
import { GoogleGenAI, Type } from '@google/genai';
import type { Flashcard, MCQ } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// --- MCQ Generation ---
const mcqSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      correctAnswerIndex: { type: Type.INTEGER },
      explanation: { type: Type.STRING, description: "A brief explanation for why the answer is correct." },
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"],
  },
};

export async function generateMCQs(text: string): Promise<MCQ[]> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Based on the following text, generate 10 high-quality multiple-choice questions suitable for a university-level student. Ensure the options are plausible distractors. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: mcqSchema,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw new Error("Failed to generate multiple-choice questions.");
  }
}

// --- Flashcard Generation (Streaming) ---
export async function generateFlashcardsStream(text: string, onChunk: (card: Flashcard) => void): Promise<void> {
  const prompt = `From the following text, extract key terms and their definitions to create flashcards. Format the output as a stream of JSON objects, with each object on a new line. Each JSON object must have a "term" and a "definition" key. Do not wrap the output in an array or markdown. Text: "${text}"`;
  
  try {
    const stream = await ai.models.generateContentStream({
      model,
      contents: prompt,
    });

    let buffer = '';
    for await (const chunk of stream) {
      buffer += chunk.text;
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep potentially incomplete last line

      for (const line of lines) {
        if (line.trim()) {
          try {
            const flashcard = JSON.parse(line);
            if (flashcard.term && flashcard.definition) {
              onChunk(flashcard);
            }
          } catch (e) {
            console.warn("Could not parse line into flashcard:", line);
          }
        }
      }
    }
     // Process any remaining content in the buffer
    if (buffer.trim()) {
        try {
            const flashcard = JSON.parse(buffer);
            if (flashcard.term && flashcard.definition) {
                onChunk(flashcard);
            }
        } catch(e) {
            console.warn("Could not parse final buffer content into flashcard:", buffer);
        }
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards.");
  }
}

// --- Summary Generation ---
export async function generateSummary(text: string): Promise<string> {
   try {
    const response = await ai.models.generateContent({
      model,
      contents: `Provide a concise but comprehensive summary of the following text. Use bullet points for key takeaways. Text: "${text}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary.");
  }
}

// --- Podcast Script Generation ---
export async function generatePodcastScript(text: string): Promise<string> {
   const prompt = `You are an expert medical educator creating a podcast script. Your audience is students learning about this topic for the first time.
    Your task is to convert the following text into an engaging podcast script.
    Follow these rules strictly:
    1. The dialect MUST be Kuwaiti Arabic. If you are unable to generate high-quality Kuwaiti Arabic, you MUST use Egyptian Arabic as a fallback.
    2. The tone should be conversational, clear, and educational.
    3. All medical, scientific, or technical terms must be pronounced in their original English/Latin form.
    4. Immediately after mentioning a technical term, you must provide a simple, easy-to-understand explanation of it in Arabic. Do not assume the listener knows anything. Explain every single term.
    5. Structure the script with clear introductions, main body content, and a conclusion. Use narrative techniques to keep it interesting.
    6. Do not just read the text. Rephrase, elaborate, and use analogies to make complex topics understandable.

    Here is the text to convert:
    ---
    ${text}
    ---`;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating podcast script:", error);
    throw new Error("Failed to generate podcast script.");
  }
}
