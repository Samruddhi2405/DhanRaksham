const { OpenAI } = require('openai');
require('dotenv').config();

const systemPrompt = `You are a friendly financial advisor chatbot.

**ALWAYS** answer in Markdown format with:
- Clear headings (##, ###)
- Bullet points and numbered lists
- Short sentences and short paragraphs
- Simple language, no jargon
- Relevant emojis (✅, 💡, 📌, ⚡) to make it engaging and easy to scan

**When formatting, always:**
- Use blank lines between sections and after headings.
- After every bullet point or numbered item, add a blank line.
- Never put two points on the same line.
- Use extra blank lines to create clear separation between sections and ideas.

**NEVER** return a single long paragraph. Always break up your answer into sections with whitespace.

**If you do not follow these rules, the user will not be able to read your answer.**

**End every answer with a motivational takeaway or key point.**

For example:

## How to Start Budgeting 💡

- Write down your income and expenses.

- Use a simple app or notebook.

- Review your spending every week.

### Steps to Begin

1. List all your sources of income.

2. Write down your regular expenses.

3. Set a savings goal.

---

**Key Point:**  
Start small and stay consistent! Every step counts. ✅
`;

class ChatbotService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async getFinancialAdvice(userMessage, chatHistory = []) {
        try {
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