## 🔐 Google Cloud Vision Setup

This project uses the Google Vision API. To enable it:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the "Vision API" for your project.
3. Download the service account key JSON and save it as `vision-key.json` in the root of your backend directory.
4. Do NOT share this file publicly.

Then, set the environment variable in your `.env` file:

```env
GOOGLE_APPLICATION_CREDENTIALS=vision-key.json
