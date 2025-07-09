const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../config.env');
console.log('ChatbotService loading environment variables from:', envPath);
dotenv.config({ path: envPath });

class ChatbotService {
    constructor() {
        // Check if GEMINI_API_KEY exists in environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('Environment variables in ChatbotService:', {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            GEMINI_API_KEY: apiKey ? 'Set' : 'Not Set'
        });

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables. Please check your config.env file.');
        }
        
        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            console.log('Successfully initialized Gemini AI model');
        } catch (error) {
            console.error('Error initializing Gemini AI:', error);
            throw new Error('Failed to initialize Gemini AI: ' + error.message);
        }
    }

    async getFinancialAdvice(userMessage, chatHistory = []) {
        try {
            if (!userMessage) {
                throw new Error('User message is required');
            }

            const systemPrompt = `You are a professional financial advisor chatbot. Format responses in a clear, point-wise style. Use this structure:

PHASE 1: [Phase Title]
• [Main Point 1]
  - [Sub-point 1]
  - [Sub-point 2]
  - [Sub-point 3]

• [Main Point 2]
  - [Sub-point 1]
  - [Sub-point 2]
  - [Sub-point 3]

PHASE 2: [Phase Title]
• [Main Point 1]
  - [Sub-point 1]
  - [Sub-point 2]
  - [Sub-point 3]

• [Main Point 2]
  - [Sub-point 1]
  - [Sub-point 2]
  - [Sub-point 3]

NEXT STEPS
1. [First step]
2. [Second step]
3. [Third step]

Formatting Rules:
1. Start each phase with a clear title
2. Use bullet points (•) for main points
3. Use dashes (-) for sub-points
4. Add line breaks between phases
5. Keep points concise and clear
6. Use numbers for sequential steps
7. Use consistent indentation
8. One point per line
9. Clear section breaks`;

            // Format chat history for Gemini
            const formattedHistory = chatHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            console.log('Starting chat session with Gemini...');
            
            // Start a chat session
            const chat = this.model.startChat({
                history: formattedHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                },
            });

            console.log('Sending message to Gemini...');
            
            // Send the message
            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            let text = response.text();

            // Format the response to ensure proper spacing and structure
            text = text
                // First, remove any asterisks and clean up the text
                .replace(/\*\*/g, '')
                .replace(/\*/g, '')
                // Convert numbered sections to bullet points
                .replace(/([IV]+\.\s*[A-Za-z\s]+)/g, '\n\n$1\n')
                // Convert numbered lists to bullet points
                .replace(/(\d+\.\s)/g, '\n• ')
                // Format bullet points
                .replace(/\*\s/g, '\n• ')
                // Add proper spacing for subsections
                .replace(/([A-Za-z\s]+:)/g, '\n$1\n')
                // Add spacing after sentences
                .replace(/([.!?])\s/g, '$1\n')
                // Clean up multiple newlines
                .replace(/\n{3,}/g, '\n\n')
                // Ensure proper spacing for bullet points
                .replace(/([•-])\s/g, '\n$1 ')
                // Add extra spacing for major sections
                .replace(/PHASE \d+:/g, '\n\n$&\n')
                .replace(/NEXT STEPS\n/g, '\nNEXT STEPS\n\n')
                // Clean up any remaining formatting issues
                .replace(/\s+/g, ' ')
                .replace(/\n\s+/g, '\n')
                .trim();

            // Split into sections and format each section
            const sections = text.split('\n\n');
            text = sections
                .map(section => {
                    // Add proper indentation for subsections
                    if (section.includes(':')) {
                        return section.split('\n').map(line => {
                            if (line.includes(':')) {
                                return `\n${line}\n`;
                            }
                            return line;
                        }).join('\n');
                    }
                    return section;
                })
                .join('\n\n');

            console.log('Successfully received and formatted response from Gemini');

            return {
                message: text,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Detailed error in getFinancialAdvice:', {
                error: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Provide a fallback response in case of errors
            if (error.message.includes('quota') || error.message.includes('429')) {
                return {
                    message: `SUMMARY
Congratulations on starting your financial journey! This guide will help you establish a solid foundation for your financial future.

KEY RECOMMENDATIONS
1. Track Your Spending
2. Create a Budget
3. Build Emergency Fund
4. Manage Debt
5. Start Retirement Planning

DETAILED EXPLANATION
1. Track Your Spending
   - Use budgeting apps (Mint, YNAB, Personal Capital)
   - Track all expenses for 1-2 months
   - Categorize spending patterns

2. Create a Budget
   - Calculate net income after deductions
   - Use 50/30/20 rule as guideline:
     • 50% for needs (housing, food, bills)
     • 30% for wants (entertainment, dining)
     • 20% for savings and debt repayment

3. Build Emergency Fund
   - Target: 3-6 months of essential expenses
   - Start with $1,000 minimum
   - Use high-yield savings account

4. Manage Debt
   - Prioritize high-interest debt
   - Consider debt snowball or avalanche method
   - Look for balance transfer opportunities

5. Start Retirement Planning
   - Maximize employer 401(k) match
   - Consider Roth IRA for tax-free growth
   - Start early to benefit from compound interest

NEXT STEPS
1. Download a budgeting app
2. Calculate your monthly net income
3. Set up automatic savings
4. Review employer benefits
5. Schedule a financial check-up in 3 months

DISCLAIMER
This is general advice. For personalized financial planning, please consult with a licensed financial advisor.`,
                    timestamp: new Date().toISOString()
                };
            }
            
            throw new Error(`Failed to get financial advice: ${error.message}`);
        }
    }
}

module.exports = new ChatbotService(); 