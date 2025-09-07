// configs/AiModel.js
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const chatSession = {
  sendMessage: async (prompt) => {
    console.log("=== AI MODEL: SENDING REQUEST ===");
    console.log("Prompt length:", prompt.length);
    console.log("API Key exists:", !!process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY);
    
    try {
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      };

      console.log("Request URL:", `${GOOGLE_API_URL}?key=${process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY?.substring(0, 10)}...`);

      const response = await fetch(`${GOOGLE_API_URL}?key=${process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      console.log("=== AI MODEL: FULL RESPONSE ===");
      console.log(JSON.stringify(data, null, 2));

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.error("No text in response");
        console.log("Candidates:", data.candidates);
        console.log("Finish reason:", data.candidates?.[0]?.finishReason);
        throw new Error("No text content in AI response");
      }

      console.log("=== AI MODEL: EXTRACTED TEXT ===");
      console.log("Text length:", text.length);
      console.log("Raw text:", text);
      
      return {
        response: {
          text: async () => text
        }
      };
    } catch (err) {
      console.error("=== AI MODEL: ERROR ===");
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      
      return {
        response: { 
          text: async () => `Error calling Gemini API: ${err.message}` 
        }
      };
    }
  }
};
