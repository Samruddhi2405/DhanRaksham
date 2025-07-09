const chatbotService = require('../services/chatbotService');

class ChatbotController {
    async getAdvice(req, res) {
        try {
            console.log('Received request in getAdvice controller');
            console.log('Request body:', req.body);
            
            const { message, chatHistory } = req.body;
            
            if (!message) {
                console.log('No message provided in request');
                return res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
            }

            console.log('Processing message:', message);
            console.log('Chat history length:', chatHistory ? chatHistory.length : 0);

            const response = await chatbotService.getFinancialAdvice(message, chatHistory);
            
            console.log('Successfully got response from service:', response);
            
            res.status(200).json({
                success: true,
                data: response
            });
        } catch (error) {
            console.error('Error in getAdvice controller:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });

            // Check if it's an OpenAI API error
            if (error.response && error.response.data) {
                console.error('OpenAI API Error:', error.response.data);
            }

            res.status(500).json({
                success: false,
                message: 'Failed to get financial advice',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = new ChatbotController(); 