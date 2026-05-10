import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export interface TripPlanParams {
  district: string;
  days: number;
  travellerType?: string;
  filters?: string[];
  startingPoint?: string;
  language?: string;
  customNotes?: string;
}

export async function generateTripPlan(params: TripPlanParams) {
  const {
    district,
    days,
    travellerType = "solo",
    filters = [],
    startingPoint = "Gangtok",
    language = "en",
    customNotes = "",
  } = params;

  const prompt = `
You are a professional travel planner for monasteries in Sikkim.  
Create a Flipkart-order-tracking styled travel itinerary.

Inputs:
- District: ${district}
- Days: ${days}
- Traveller Type: ${travellerType}
- Starting Point: ${startingPoint}
- Filters: ${filters.join(", ") || "None"}
- Language: ${language}
- Extra Notes: ${customNotes}

Return JSON in this exact schema:

{
  "statusFlow": [
    { "stage": "Trip Planning Started", "description": "" },
    { "stage": "Itinerary Building", "description": "" },
    { "stage": "Activity Optimization", "description": "" },
    { "stage": "Route Mapping", "description": "" },
    { "stage": "Final Itinerary Ready", "description": "" }
  ],
  "itinerary": {
    "dayWise": {
      "Day 1": [],
      "Day 2": [],
      "Day 3": []
    },
    "travelTips": [],
    "estimatedBudget": {
      "low": "",
      "medium": "",
      "high": ""
    }
  }
}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // FREE tier supported
    contents: prompt,
  });

  return response.text;
}
