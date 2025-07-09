const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  generalFinancePrompt,
  structuredFinancePrompt,
} = require("../config/prompt");

class GeminiService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);

    // Configuration for structured JSON responses
    this.structuredConfig = {
      temperature: 0.0,
      maxOutputTokens: 4000,
      responseMimeType: "application/json",
    };

    // Configuration for general narrative responses
    this.generalConfig = {
      temperature: 0.1,
      maxOutputTokens: 6000,
      topP: 0.95,
      topK: 40,
    };

    // Configuration for detailed finance responses
    this.detailedConfig = {
      temperature: 0.2,
      maxOutputTokens: 8000,
      topP: 0.95,
      topK: 40,
    };
  }

  // Helper method to determine if query is finance-related
  isFinanceQuery(query) {
    const financeKeywords = [
      "finance",
      "money",
      "investment",
      "portfolio",
      "stock",
      "bond",
      "mutual fund",
      "etf",
      "retirement",
      "pension",
      "insurance",
      "tax",
      "banking",
      "credit",
      "loan",
      "mortgage",
      "debt",
      "savings",
      "budget",
      "estate",
      "wealth",
      "financial",
    ];

    return financeKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Helper method to determine if query needs structured response
  isStructuredQuery(query) {
    const structuredKeywords = [
      "investment",
      "portfolio",
      "risk analysis",
      "returns",
      "market analysis",
      "financial planning",
      "retirement",
      "asset allocation",
      "risk management",
      "wealth management",
    ];

    return structuredKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async getStructuredFinanceResponse(userInput) {
    try {
      if (!this.isFinanceQuery(userInput)) {
        return {
          status: "non-finance",
          message:
            "I am a financial expert with over 70 years of experience. I can only assist with finance-related questions such as:\n- Personal financial planning and wealth building\n- Investment strategies and portfolio management\n- Retirement planning and pension solutions\n- Insurance and risk management\n- Banking and credit management\n- Tax planning and optimization\n- Estate planning and wealth transfer\n- Protection against financial frauds and scams\nPlease feel free to ask any questions about these financial topics.",
        };
      }

      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: this.structuredConfig,
      });

      const fullPrompt = `${structuredFinancePrompt}\n\nQuery: ${userInput}\n\nProvide a comprehensive JSON response with detailed historical context, practical examples, and specific guidance based on 70+ years of experience.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response.text();

      if (!response) {
        throw new Error("Empty response from Gemini");
      }

      try {
        const parsedResponse = JSON.parse(response);
        return {
          status: "success",
          data: parsedResponse,
        };
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Invalid JSON response from model");
      }
    } catch (error) {
      console.error("Structured Finance Service Error:", error);
      throw new Error(`Structured finance service error: ${error.message}`);
    }
  }

  async getGeneralFinanceResponse(userInput) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: this.generalConfig,
      });

      const fullPrompt = `${generalFinancePrompt}\n\nQuery: ${userInput}\n\nResponse:`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response.text();

      if (!response) {
        throw new Error("Empty response from Gemini");
      }

      return response;
    } catch (error) {
      console.error("Gemini General Finance Service Error:", error);
      throw new Error(`General finance service error: ${error.message}`);
    }
  }

  async getFinanceResponse(userInput) {
    try {
      if (!this.isFinanceQuery(userInput)) {
        return "I am a financial expert with over 70 years of experience. I can only assist with finance-related questions such as:\n- Personal financial planning and wealth building\n- Investment strategies and portfolio management\n- Retirement planning and pension solutions\n- Insurance and risk management\n- Banking and credit management\n- Tax planning and optimization\n- Estate planning and wealth transfer\n- Protection against financial frauds and scams\nPlease feel free to ask any questions about these financial topics.";
      }

      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: this.detailedConfig,
      });

      const fullPrompt = `${generalFinancePrompt}\n\nQuery: ${userInput}\n\nProvide a comprehensive response with detailed examples from 70+ years of experience, including specific numbers, historical events, and practical steps. Remember to maintain technical accuracy while using clear language.`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response.text();

      if (!response) {
        throw new Error("Empty response from Gemini");
      }

      return response;
    } catch (error) {
      console.error("Finance Service Error:", error);
      throw new Error(`Finance service error: ${error.message}`);
    }
  }

  async getResponse(userInput) {
    try {
      if (this.isStructuredQuery(userInput)) {
        return await this.getStructuredFinanceResponse(userInput);
      } else {
        const response = await this.getFinanceResponse(userInput);
        return {
          status: "success",
          data: response,
        };
      }
    } catch (error) {
      console.error("Finance Service Error:", error);
      throw new Error(`Finance service error: ${error.message}`);
    }
  }
}

module.exports = GeminiService;
