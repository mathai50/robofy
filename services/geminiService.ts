import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ComprehensiveAnalysis, Competitor } from "../src/types";

interface LibraryGroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const extractJson = (text: string): string | null => {
  const firstBracket = text.indexOf('{');
  const lastBracket = text.lastIndexOf('}');
  const firstSquare = text.indexOf('[');
  const lastSquare = text.lastIndexOf(']');

  let start = -1;
  let end = -1;

  if (firstBracket !== -1 && lastBracket !== -1) {
    if (firstSquare !== -1 && lastSquare !== -1) {
      // both are present, pick the outermost
      if (firstBracket < firstSquare) {
        start = firstBracket;
        end = lastBracket;
      } else {
        start = firstSquare;
        end = lastSquare;
      }
    } else {
      start = firstBracket;
      end = lastBracket;
    }
  } else if (firstSquare !== -1 && lastSquare !== -1) {
    start = firstSquare;
    end = lastSquare;
  }

  if (start === -1 || end === -1) {
    return null;
  }

  return text.substring(start, end + 1);
};

const validateCompetitors = async (query: string, location: string, organicResults: any[]): Promise<Competitor[]> => {
  const prompt = `
    You are an expert market analyst. I will provide you with a list of Google search results for the query "top ${query} companies in ${location}".
    Your task is to identify the direct business competitors from this list.
    - Focus on companies or organizations that offer services or products directly related to "${query}".
    - IGNORE informational content like blog posts, news articles, listicles (e.g., "10 best..."), and directories.
    - Return a JSON array of the top 3-5 most relevant business competitors.
    - Each object in the array MUST contain "rank", "url", and "title" from the original search result.
    - If you cannot find at least 3 relevant business competitors, return an empty array.
    - Do not add any explanation, commentary, or markdown fences. Return ONLY the raw JSON array.

    Here are the search results:
    \`\`\`json
    ${JSON.stringify(organicResults, null, 2)}
    \`\`\`
  `;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = extractJson(text);
    if (!jsonString) return [];
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error validating competitors with Gemini:", error);
    return []; // Return empty array on failure to not block the main analysis
  }
}

export const generateComprehensiveAnalysis = async (
  url: string,
  query: string,
  location: string,
  pageSpeedData: any,
  serpData: any
): Promise<ComprehensiveAnalysis> => {

  const organicResults = serpData?.organic_results || [];
  const validatedCompetitors = await validateCompetitors(query, location, organicResults);

  if (validatedCompetitors.length === 0) {
      // Fallback or error if no valid competitors are found
      console.warn("No valid business competitors were identified. Analysis may be limited.");
      // We can proceed with a limited analysis or throw an error. Let's proceed for now.
  }

  const prompt = `
    Analyze the following URL in the context of its key business competitors to generate a comprehensive SEO strategy.

    **Target URL:** ${url}
    **Target Search Query:** "${query}"
    **Geographical Context:** ${location}

    **Technical SEO Data (from Google PageSpeed Insights):**
    \`\`\`json
    ${JSON.stringify(pageSpeedData, null, 2)}
    \`\`\`

    **Validated Business Competitors (You must use this list for your analysis):**
    \`\`\`json
    ${JSON.stringify(validatedCompetitors, null, 2)}
    \`\`\`

    **Your Task:**
    As an expert SEO strategist, perform a comprehensive analysis and return a single JSON object. Use Google Search grounding to inform your analysis.

    1.  **Technical SEO:**
        -   Analyze the provided PageSpeed Insights JSON.
        -   Provide the score as a string for each category, a status ('good' >= 90, 'warning' >= 50, 'bad' < 50), and an actionable recommendation.
        -   Calculate an \`overallScore\` by averaging the five category scores, rounded to the nearest integer.

    2.  **Keywords:**
        -   Based on the titles and content of the **validated business competitors**, not generic articles, identify 5-7 relevant keywords the target URL should focus on.
        -   Classify them as 'Primary', 'Secondary', or 'LSI'.
        -   Provide brief notes on their relevance in the context of competing with these businesses.

    3.  **Competitors:**
        -   For each of the **validated business competitors**, provide a brief analysis of their strategic positioning, strengths, or unique selling proposition based on their page title and inferred content.

    4.  **Content Gaps:**
        -   By comparing the target URL's likely content to the strategies of the **validated competitors**, identify 3-4 content gaps or strategic opportunities.
        -   Provide the topic and a recommendation for how the target URL can address this gap to compete more effectively.

    Return ONLY the JSON object. Do not include any introductory text, markdown formatting, or anything else besides the raw JSON content.
    The required JSON structure is: { "technicalSeo": { "overallScore": number, "performance": { "metric": string, "status": "good"|"warning"|"bad", "recommendation": string }, "accessibility": { "metric": string, "status": "good"|"warning"|"bad", "recommendation": string }, "bestPractices": { "metric": string, "status": "good"|"warning"|"bad", "recommendation": string }, "seo": { "metric": string, "status": "good"|"warning"|"bad", "recommendation": string }, "pwa": { "metric": string, "status": "good"|"warning"|"bad", "recommendation": string } }, "keywords": [ { "keyword": string, "type": "Primary"|"Secondary"|"LSI", "notes": string } ], "competitors": [ { "rank": number, "url": string, "title": string, "analysis": string } ], "contentGaps": [ { "topic": string, "recommendation": string } ] }
    `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const rawText = response.text();
    const jsonString = extractJson(rawText);

    if (!jsonString) {
        console.error("Could not find a valid JSON object in the Gemini response:", rawText);
        throw new Error("The analysis returned an invalid format (no JSON object found).");
    }
    
    let analysisResult: ComprehensiveAnalysis;
    try {
        analysisResult = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", jsonString);
        throw new Error("The analysis returned an invalid format.");
    }
    
    // Ensure the competitors in the final output are the ones we validated
    analysisResult.competitors = validatedCompetitors.map(vc => {
        const foundAnalysis = analysisResult.competitors.find((ac: Competitor) => ac.url === vc.url);
        return {
            ...vc,
            analysis: foundAnalysis?.analysis || "No specific analysis generated for this competitor."
        };
    });

    if (result.response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        // FIX: Explicitly map the library's GroundingChunk type to our internal type
        // to resolve the TypeScript compilation error.
        analysisResult.groundingChunks = result.response.candidates[0].groundingMetadata.groundingChunks
            .filter((chunk: LibraryGroundingChunk) => chunk.web && chunk.web.uri)
            .map((chunk: LibraryGroundingChunk) => ({
                web: { uri: chunk.web!.uri!, title: chunk.web!.title || '' }
            }));
    }

    return analysisResult;
  } catch (error) {
    console.error("Error generating analysis with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};