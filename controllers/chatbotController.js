const chatbotService = require('../services/chatbotService');

class ChatbotController {
    async getAdvice(req, res) {
        try {
            const { message, chatHistory } = req.body;
            
            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: 'Message is required'
                });
            }

            const response = await chatbotService.getFinancialAdvice(message, chatHistory);
            
            res.status(200).json({
                success: true,
                data: response
            });
        } catch (error) {
            console.error('Error in getAdvice:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get financial advice',
                error: error.message
            });
        }
    }
}

module.exports = new ChatbotController(); 