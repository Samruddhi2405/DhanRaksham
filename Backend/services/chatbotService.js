const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../config.env');
dotenv.config({ path: envPath });

class ChatbotService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log('✅ Gemini AI initialized successfully');
  }

  async getFinancialAdvice(userMessage, chatHistory = []) {
    if (!userMessage) {
      throw new Error('User message is required');
    }

    // 🧠 Strong system prompt for structured answers
    const systemPrompt = `
You are a professional financial advisor chatbot. Always respond in clear, structured **Markdown**.

✅ Formatting rules:
- Start with a friendly greeting.
- Use headings (#, ##) with relevant emojis.
- Use bullet points (•) for main points.
- Use dashes (-) for sub-points if needed.
- Use numbered lists for sequential steps.
- Add blank lines between sections and bullet points.
- Never combine multiple points on the same line.
- Keep responses concise and clear.
- End with an encouraging closing note.

📌 Example structure:

# 📊 Overview

Brief context here.

## ✅ Key Takeaways

• Point 1

• Point 2

## 📌 Next Steps

1. Do this
2. Then that

💡 *Always consult a licensed advisor for personalized planning.*
`;

    // Format chat history for Gemini
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    try {
      const chat = this.model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.3,       // lower temperature for clear, structured replies
          maxOutputTokens: 700,   // adjust as needed
        },
      });

      const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${userMessage}`);
      const response = await result.response;
      const text = response.text().trim();

      console.log('✅ Gemini AI response received and formatted.');

      return {
        message: text,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error('❌ Error in getFinancialAdvice:', {
        message: error.message,
        stack: error.stack,
      });

      return {
        message: `⚠️ Sorry, I couldn't process your request right now. Please try again shortly!`,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

module.exports = new ChatbotService();
