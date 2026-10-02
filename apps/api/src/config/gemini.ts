import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const isValidKey = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim().length > 15;

export const geminiClient = isValidKey ? new GoogleGenAI({ apiKey }) : null;

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
