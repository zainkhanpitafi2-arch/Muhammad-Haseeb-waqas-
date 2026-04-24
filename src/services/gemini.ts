import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface CampaignData {
  subjectLines: string[];
  body: string;
  imagePrompt: string;
  visualTheme: string;
}

export async function generateCampaign(prompt: string, tone: string = "professional"): Promise<CampaignData> {
  const systemInstruction = `
    You are an expert digital marketing strategist and copywriter.
    Your goal is to generate a high-converting email marketing campaign based on the user's prompt.
    
    You must output a JSON object with the following fields:
    - subjectLines: An array of 3-5 compelling subject lines.
    - body: The main email body copy in Markdown format. Include placeholders like [Name] where appropriate.
    - imagePrompt: A detailed, descriptive prompt for an AI image generator that matches the campaign's theme.
    - visualTheme: A short string describing the visual style (e.g., "minimalist", "vibrant", "corporate").

    The tone should be: ${tone}.
    Make the copy persuasive, engaging, and clear.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Campaign Prompt: ${prompt}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjectLines: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          body: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          visualTheme: { type: Type.STRING }
        },
        required: ["subjectLines", "body", "imagePrompt", "visualTheme"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateCampaignImage(imagePrompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `${imagePrompt}, photorealistic, high quality marketing asset, 16:9 aspect ratio`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  return imageUrl;
}
