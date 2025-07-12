# DhanRaksham Setup Guide

## Database Setup

### MongoDB Configuration

1. **Local MongoDB Setup:**
   - Install MongoDB locally or use Docker
   - Use the default connection string: `mongodb://localhost:27017/dhanraksham`

2. **MongoDB Atlas Setup (Cloud):**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Add your IP address to the IP Access List
   - Create a database user with read/write permissions
   - Get your connection string from the "Connect" button
   - Replace the MONGODB_URI in your `config.env` file

### Environment Variables Setup

1. Copy the example environment file:
   ```bash
   cp env.example Backend/config.env
   ```

2. Edit `Backend/config.env` and fill in your actual values:
   ```env
   # Required Variables
   PORT=5000
   MONGODB_URI=your_actual_mongodb_connection_string
   GEMINI_API_KEY=your_actual_gemini_api_key
   JWT_SECRET=your_actual_jwt_secret_key
   ```

## API Keys Required

### Google Generative AI (Gemini)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `config.env` as `GEMINI_API_KEY`

### MongoDB Atlas (Optional)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string from the dashboard
4. Add it to your `config.env` as `MONGODB_URI`

## Security Notes

- Never commit your actual `config.env` file to version control
- The `.gitignore` file is configured to exclude sensitive files
- Always use environment variables for sensitive configuration
- Regularly rotate your API keys and secrets 