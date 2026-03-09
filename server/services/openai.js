import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeListing = async (listingData) => {
  try {
    const prompt = `
      You are an expert Airbnb hosting consultant and copywriter.
      Analyze the following basic information about an Airbnb listing:
      
      URL: ${listingData.url}
      Title: ${listingData.title}
      Description: ${listingData.description}
      
      Provide actionable advice based on standard Airbnb SEO rules.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Airbnb listing optimizer. Return structured JSON exactly matching the requested schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            descriptionImprovements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            photoTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            pricingAdvice: { type: Type.STRING },
            improvementChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            }
          },
          required: ["titleSuggestions", "descriptionImprovements", "photoTips", "pricingAdvice", "improvementChecklist"]
        }
      }
    });

    const analysis = JSON.parse(response.text);
    return { success: true, analysis };
  } catch (error) {
    console.error('Gemini Error:', error);
    return { success: false, error: 'Failed to generate AI analysis via Gemini.' };
  }
};
