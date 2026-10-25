import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/apiError.js";

let client = null;

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new ApiError(
      503,
      "Gemini API key is not configured. Add GEMINI_API_KEY to the backend .env file."
    );
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
};

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIConfigured = () => Boolean(process.env.GEMINI_API_KEY);

export const generateText = async (prompt, temperature = 0.7) => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature,
      },
    });

    return response.text;
  } catch (err) {
    console.error("Gemini text error:", err.message || err);

    throw new ApiError(
      502,
      "AI request failed. Please try again in a moment."
    );
  }
};

export const generateJSON = async (prompt, schema) => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.6,
      },
    });

    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini JSON error:", err.message || err);

    throw new ApiError(
      502,
      "AI request failed. Please try again in a moment."
    );
  }
};

// =========================
// Lead Assessment
// =========================

export const generateLeadAssessment = async (lead) => {
  const prompt = `
You are an expert B2B sales analyst for a CRM called TIP CRM.

Analyze the following sales lead and produce a concise assessment.

Lead Details:
- Name: ${lead.name || "N/A"}
- Company: ${lead.company || "Unknown"}
- Email: ${lead.email || ""}
- Current pipeline stage: ${lead.status || "New"}
- Potential deal value: $${lead.value || 0}
- Source: ${lead.source || "Unknown"}
- Notes: ${lead.notes || "None"}
`;

  const schema = {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "2-3 sentence executive summary of the lead"
      },
      riskScore: {
        type: "integer",
        description: "Risk of losing this deal, 0 = safe to 100 = high risk"
      },
      suggestedPriority: {
        type: "string",
        enum: ["Low", "Medium", "High"]
      },
      nextAction: {
        type: "string"
      },
      followUpDays: {
        type: "integer"
      }
    },
    required: [
      "summary",
      "riskScore",
      "suggestedPriority",
      "nextAction",
      "followUpDays"
    ]
  };

  return generateJSON(prompt, schema);
};

// =========================
// Email Generator
// =========================

export const generateFollowupEmail = async (lead) => {
  const prompt = `
Write a professional follow-up email.

Lead Name: ${lead.name}
Company: ${lead.company}
Current Stage: ${lead.status}
Notes: ${lead.notes}

Return only the email.
`;

  return generateText(prompt);
};

// =========================
// Meeting Summary
// =========================

export const summarizeMeeting = async (notes) => {
  const prompt = `
Summarize these CRM meeting notes into bullet points.

${notes}
`;

  return generateText(prompt);
};