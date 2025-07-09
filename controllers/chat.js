const GeminiService = require("../services/gemini.service");
const catchAsync = require("../utils/catchAsync");

// Initialize Gemini service with API key
const geminiService = new GeminiService(process.env.GEMINI_API_KEY);

exports.getFinanceResponse = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Query is required",
    });
  }

  const response = await geminiService.getFinanceResponse(query);

  res.status(200).json({
    status: "success",
    data: response,
  });
});

exports.getStructuredFinanceResponse = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Query is required",
    });
  }

  const response = await geminiService.getStructuredFinanceResponse(query);

  try {
    // The response is already validated in the service layer
    res.status(200).json(response);
  } catch (error) {
    console.error("Finance Controller Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process financial query",
      technicalDetails: error.message,
    });
  }
});

exports.getUnifiedFinanceResponse = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Query is required",
    });
  }

  // This will automatically determine if structured or general response is needed
  const response = await geminiService.getResponse(query);

  res.status(200).json(response);
});
