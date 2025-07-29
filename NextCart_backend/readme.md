## 🔐 Google Cloud Vision Setup

This project uses the Google Vision API. To enable it:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the "Vision API" for your project.
3. Download the service account key JSON and save it as `vision-key.json` in the root of your backend directory.
4. Do NOT share this file publicly.

Then, set the environment variable in your `.env` file:

```env
GOOGLE_APPLICATION_CREDENTIALS=vision-key.json
##create a .env in backend like this-
# Server port
PORT=5000

# MongoDB connection string
MONGO_URI=your_mongodb_connection_string

# JWT authentication secret
JWT_SECRET=your_jwt_secret

# OpenRouter API key (for AI/chatbot)
OPENROUTER_API_KEY=your_openrouter_api_key

# Admin and Super Admin secret keys
ADMIN_SECRET=your_admin_secret
SUPER_ADMIN_SECRET=your_super_admin_secret

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Backend URL (used by frontend, should match VITE config)
VITE_BACKEND_URL=http://localhost:5000

# Path to Vision API credentials file
GOOGLE_APPLICATION_CREDENTIALS=vision-key.json
