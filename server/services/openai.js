import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeListing = async (listingData) => {
    try {
        const prompt = `
      You are an expert Airbnb hosting consultant and copywriter.
      Analyze the following basic information about an Airbnb listing:
      
      URL: ${listingData.url}
      Title: ${listingData.title}
      Description: ${listingData.description}
      
      Provide actionable advice in the following JSON format ONLY (do not include markdown wrapping like \`\`\`json):
      {
        "titleSuggestions": [
          "Suggestion 1", "Suggestion 2", "Suggestion 3"
        ],
        "descriptionImprovements": [
          "Point 1", "Point 2"
        ],
        "photoTips": [
          "Tip 1", "Tip 2"
        ],
        "pricingAdvice": "General advice on pricing based on the current market.",
        "improvementChecklist": [
          "Actionable item 1", "Actionable item 2"
        ]
      }
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // Assume we use the latest model
            messages: [
                { role: "system", content: "You are a professional Airbnb listing optimizer." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(response.choices[0].message.content);
        return { success: true, analysis };
    } catch (error) {
        console.error('OpenAI Error:', error);
        return { success: false, error: 'Failed to generate AI analysis.' };
    }
};
