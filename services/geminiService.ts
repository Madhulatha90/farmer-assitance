
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getAdvisory(text: string, imageBase64?: string): Promise<string> {
    try {
      const parts: any[] = [{ text: text || "Help me with my crop." }];
      
      if (imageBase64) {
        // Extract base64 data and mime type
        const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      if (error instanceof Error && error.message.includes("429")) {
        throw new Error("Too many requests. Please wait a moment.");
      }
      throw new Error("Failed to get advice. Check your internet or API key.");
    }
  }
}

export const geminiService = new GeminiService();
