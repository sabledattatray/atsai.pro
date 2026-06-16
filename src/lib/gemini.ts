// Gemini AI client singleton — server-side only
// Do NOT import this in client components
import { GoogleGenAI } from '@google/genai';

let _ai: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!_ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set.');
    }
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}
