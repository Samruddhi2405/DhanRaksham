const { OpenAI } = require('openai');
require('dotenv').config();

class ChatbotService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async getFinancialAdvice(userMessage, chatHistory = []) {
        try {
            const systemPrompt = `You are a professional financial advisor chatbot. Your role is to provide accurate, 
            helpful, and ethical financial advice. Always:
            1. Consider the user's financial situation
            2. Provide clear, actionable advice
            3. Include relevant financial concepts and terms
            4. Maintain a professional and supportive tone
            5. Disclaim that this is general advice and users should consult professionals for specific situations`;

            const messages = [
                { role: 'system', content: systemPrompt },
                ...chatHistory,
                { role: 'user', content: userMessage }
            ];

            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            });

            return {
                message: response.choices[0].message.content,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error in getFinancialAdvice:', error);
            throw new Error('Failed to get financial advice');
        }
    }
}

module.exports = new ChatbotService(); 