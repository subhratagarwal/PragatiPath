import { GoogleGenAI, Type, Chat } from "@google/genai";
import { IssueCategory } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be a fatal error.
  // For this environment, we will mock the API key.
  process.env.API_KEY = "mock-api-key-for-local-dev";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_DESCRIPTION_RESPONSE = "A large, deep pothole is visible in the center of an asphalt road, posing a potential hazard to vehicles.";

const MOCK_ANALYSIS_RESPONSE: { isRelevant: boolean; category: IssueCategory; priority: 'Low' | 'Medium' | 'High' | 'Critical'; reasoning: string } = {
    isRelevant: true,
    category: IssueCategory.Pothole,
    priority: "High",
    reasoning: "The image shows a large, deep pothole on a busy road, which poses a significant risk to vehicles and cyclists. The text confirms it has already caused damage."
};

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string; } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string."));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const generateDescriptionFromImage = async (imageFile: File): Promise<string> => {
  if (process.env.API_KEY === "mock-api-key-for-local-dev") {
    console.warn("Using mock Gemini API for description generation.");
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate delay
    return MOCK_DESCRIPTION_RESPONSE;
  }
  
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: "Describe the civic issue shown in this image in one clear and concise sentence. Focus on the main problem." },
        ],
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    return MOCK_DESCRIPTION_RESPONSE; // Fallback
  }
};


export const analyzeIssue = async (imageFile: File, description: string): Promise<{ isRelevant: boolean; category: IssueCategory; priority: 'Low' | 'Medium' | 'High' | 'Critical'; reasoning: string }> => {
  if (process.env.API_KEY === "mock-api-key-for-local-dev") {
    console.warn("Using mock Gemini API response. Please provide a real API key.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return MOCK_ANALYSIS_RESPONSE;
  }
  
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: description },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isRelevant: {
              type: Type.BOOLEAN,
              description: "Does the image, along with the description, depict a genuine public civic issue (like potholes, graffiti, waste, etc.)? Set to false for irrelevant images like selfies, ID cards, or random photos."
            },
            category: {
              type: Type.STRING,
              description: "If relevant, categorize the issue into one of the following: 'Pothole', 'Broken Streetlight', 'Waste Management', 'Graffiti', 'Public Transport', 'Other'. If not relevant, this can be 'Other'.",
              enum: Object.values(IssueCategory),
            },
            priority: {
              type: Type.STRING,
              description: "If relevant, assess the priority level as 'Low', 'Medium', 'High', or 'Critical'. If not relevant, this can be 'Low'.",
              enum: ['Low', 'Medium', 'High', 'Critical'],
            },
            reasoning: {
                type: Type.STRING,
                description: "Provide a brief one-sentence explanation for the chosen category and priority. If not relevant, explain why (e.g., 'Image is a selfie.')."
            }
          },
          required: ["isRelevant", "category", "priority", "reasoning"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error analyzing issue with Gemini API:", error);
    // Fallback to mock response on error
    return MOCK_ANALYSIS_RESPONSE;
  }
};

// --- Chat Service ---

const MOCK_CHAT_RESPONSE = "I am PragatiPath AI, your virtual assistant. I can answer questions about the platform, help you report issues, or check the status of an existing report if you provide the ID.";

const MOCK_CHAT_RESPONSES: { [key: string]: string } = {
  "default": "I'm sorry, I can only provide mock responses in this demo environment. How else can I assist you with PragatiPath?",
  "report": "To report an issue, please click the 'Report Issue' button in the navigation bar. You'll be guided to upload a photo and provide details.",
  "i1": "Issue #i1 (Massive Pothole on Main St) is currently 'Acknowledged'. A team is scheduled for repair within 48 hours.",
  "i2": "Issue #i2 (Streetlight out at Oak Park) has been 'Resolved'. The bulb was replaced and tested.",
  "i3": "Issue #i3 (Overflowing bins at City Market) is still 'Reported'. The sanitation department has been notified.",
};

let chat: Chat | null = null;

export const startChatSession = async (): Promise<Chat> => {
    if (process.env.API_KEY === "mock-api-key-for-local-dev") {
        console.warn("Using mock Gemini API for chat.");
        // Return a mock chat object. It won't be used, but it fulfills the type.
        return {} as Chat;
    }

    if (chat) return chat;

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are PragatiPath AI, a friendly and helpful assistant for the Civic Issue Reporting System. Your primary goal is to assist users. You can answer questions about how to use the platform (e.g., 'how to report an issue'), provide status updates for a specific issue if the user provides an Issue ID (e.g., 'i1', 'i2'), and answer general FAQs. Keep your answers concise, friendly, and helpful. Do not go off-topic.",
        },
    });
    return chat;
}

export const sendMessageToChat = async (chatInstance: Chat, message: string): Promise<string> => {
     if (process.env.API_KEY === "mock-api-key-for-local-dev") {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        const lowerCaseMessage = message.toLowerCase();
        if (lowerCaseMessage.includes('report')) {
            return MOCK_CHAT_RESPONSES.report;
        }
        const issueIdMatch = lowerCaseMessage.match(/\b(i[1-3])\b/);
        if (issueIdMatch) {
            return MOCK_CHAT_RESPONSES[issueIdMatch[1]] || MOCK_CHAT_RESPONSES.default;
        }
        if (lowerCaseMessage.startsWith('hi') || lowerCaseMessage.startsWith('hello')) {
            return MOCK_CHAT_RESPONSE;
        }
        return MOCK_CHAT_RESPONSES.default;
    }
    
    try {
        const response = await chatInstance.sendMessage({ message });
        return response.text.trim();
    } catch (error) {
        console.error("Error sending message with Gemini API:", error);
        return "Sorry, I encountered an error. Please try again later.";
    }
}