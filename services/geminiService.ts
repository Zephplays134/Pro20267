
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export interface ShipGenerationResult {
  imageUrl: string;
  name: string;
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async chat(message: string, history: { role: string; parts: { text: string }[] }[]) {
    const chatSession = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the Virtual Captain of the Cruise Ship Simulator. 
        Your goal is to help users conceptualize and design cruise ships. 
        You have two modes: 
        1. Roblox Mode: Focus on blocky models, vibrant colors, and low-poly structures.
        2. Real-Life Mode: Focus on engineering, massive scale, luxury aesthetics, and realistic naval architecture.
        
        Use a friendly, enthusiastic, and nautical tone. 
        If a user asks for real-life ships, provide facts and inspiration from actual famous vessels (like Icon of the Seas or Titanic).
        If they ask to "generate", "create", or "see" a ship, explain that you are preparing the visual concepts.`,
      }
    });

    const response = await chatSession.sendMessage({ message });
    return response.text;
  }

  private deriveName(prompt: string): string {
    // Clean up prompt to create a "Ship Name"
    const commonWords = ['generate', 'create', 'build', 'see', 'show', 'make', 'image', 'picture', 'photo', 'draw', 'a', 'the', 'of', 'with', 'real', 'life', 'roblox', 'style'];
    const words = prompt.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => !commonWords.includes(word) && word.length > 2);
    
    if (words.length === 0) return "SS Discovery";
    
    const capitalized = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1));
    const prefix = prompt.toLowerCase().includes('real life') ? 'MS' : 'SS';
    return `${prefix} ${capitalized.join(' ')}`;
  }

  async generateShipImage(prompt: string): Promise<ShipGenerationResult | undefined> {
    const isRealLife = /real life|realistic|actual|photo|photography|real world/i.test(prompt);
    
    let fullPrompt = "";
    if (isRealLife) {
      fullPrompt = `A stunning, hyper-realistic professional photograph of a massive modern cruise ship from real life, ${prompt}. 
      Cinematic lighting, high resolution, 8k, detailed hull, luxury balconies, sunset ocean background, 
      realistic water displacement, professional travel photography style.`;
    } else {
      fullPrompt = `A high-quality Roblox-style cruise ship, ${prompt}. 
      Aesthetic: blocky shapes, vibrant colors, Roblox character mini-figures on deck, 
      shining ocean, Roblox simulator vibes, 3D render, vibrant lighting, low-poly but polished.`;
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const name = this.deriveName(prompt);

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          imageUrl: `data:image/png;base64,${part.inlineData.data}`,
          name: name
        };
      }
    }
    return undefined;
  }
}

export const geminiService = new GeminiService();
