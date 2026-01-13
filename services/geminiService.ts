import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio } from "../types";

const apiKey = process.env.API_KEY || ''; // Ensure this is available

const getAiClient = () => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Chat & Search ---

export const sendChatMessage = async (
  message: string,
  mode: 'pro' | 'fast' | 'search' | 'maps',
  location?: { lat: number; lng: number }
) => {
  const ai = getAiClient();
  let model = 'gemini-3-pro-preview';
  let tools: any[] = [];
  let toolConfig: any = undefined;

  if (mode === 'fast') {
    model = 'gemini-2.5-flash-lite-latest';
  } else if (mode === 'search') {
    model = 'gemini-3-flash-preview';
    tools = [{ googleSearch: {} }];
  } else if (mode === 'maps') {
    model = 'gemini-2.5-flash';
    tools = [{ googleMaps: {} }];
    if (location) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        tools: tools.length > 0 ? tools : undefined,
        toolConfig,
        systemInstruction: "You are a helpful, cute, and friendly assistant for a personal journal app named 'Lulu Cute'. Keep responses concise and helpful.",
      }
    });
    return {
      text: response.text || "No text response",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

// --- Image Generation ---

export const generateImage = async (prompt: string, aspectRatio: AspectRatio) => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image gen error:", error);
    throw error;
  }
};

// --- Image Editing ---

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAiClient();
  // Remove data URL prefix if present for the API call
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or converting logic elsewhere, strict typing needed
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image returned");
  } catch (error) {
    console.error("Image edit error:", error);
    throw error;
  }
};

// --- Image Analysis ---

export const analyzeImage = async (base64Image: string) => {
  const ai = getAiClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Generic assumption for analysis
              data: cleanBase64
            }
          },
          { text: "Describe this image in detail, suitable for a journal entry. Keep it warm and cute." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};
