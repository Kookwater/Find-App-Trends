import { GoogleGenAI } from "@google/genai";
import type { SearchResult, CardData, Source } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

async function generateContentWithSearch(prompt: string): Promise<SearchResult> {
  const model = "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
      // REMOVED: responseMimeType and responseSchema are not compatible with the googleSearch tool.
    },
  });

  const text = response.text;
  let parsedData: CardData[] = [];
  try {
    // The model might return the JSON in a markdown block, so we extract it.
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text.trim();
    parsedData = JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse JSON response:", error, "Raw text:", text);
    // Return an empty array if parsing fails, so the UI can handle it gracefully.
    return { data: [], sources: [] };
  }

  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources: Source[] = groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      uri: chunk.web?.uri || '',
      title: chunk.web?.title || 'Untitled Source',
    }))
    .filter((source: Source) => source.uri) ?? [];
  
  // Deduplicate sources
  const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

  return { data: parsedData, sources: uniqueSources };
}

const jsonInstruction = `
Respond with a valid JSON array of objects, where each object has a "title" and a "description".
The JSON should be enclosed in a markdown code block like this:
\`\`\`json
[
  {
    "title": "Example Title",
    "description": "Example description."
  }
]
\`\`\`
Do not include any other text, introductory sentences, or explanations outside of the markdown code block.
`;

export const getTrendingAppIdeas = (): Promise<SearchResult> => {
  const prompt = `What are the most popular and trending app ideas to build right now? Provide a list of 5 ideas.${jsonInstruction}`;
  return generateContentWithSearch(prompt);
};

export const getTopDownloadedApps = (): Promise<SearchResult> => {
  const prompt = `What are the 5 most downloaded apps currently on the Google Play Store and Apple App Store combined? List them with a short summary of what they do.${jsonInstruction}`;
  return generateContentWithSearch(prompt);
};

export const getPopularNiches = (): Promise<SearchResult> => {
  const prompt = `What are the 5 most favorite and profitable niches for mobile apps in the current market? List the top niches.${jsonInstruction}`;
  return generateContentWithSearch(prompt);
};

export const getAppsByDownloads = (): Promise<SearchResult> => {
  const prompt = `List 5 popular apps with download counts in the ranges of 500k-1M, 2-3M, and 4-5M. Cover diverse niches like video editing, productivity, and utilities. For each app, provide its name and a brief description that includes its estimated download range.${jsonInstruction}`;
  return generateContentWithSearch(prompt);
};

export const getRecentTrends = (): Promise<SearchResult> => {
  const prompt = `What are the top 5 most significant app trends that have emerged in the last 2 weeks? Focus on new technologies, user behaviors, or viral app concepts.${jsonInstruction}`;
  return generateContentWithSearch(prompt);
};

export const getCustomSearchResult = (query: string): Promise<SearchResult> => {
  const prompt = `Based on the following query, provide a list of 5 relevant app ideas, existing popular apps, or market niches. Query: "${query}".${jsonInstruction}`;
  return generateContentWithSearch(prompt);
};
