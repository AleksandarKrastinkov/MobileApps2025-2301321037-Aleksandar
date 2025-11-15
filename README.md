# 🌿 Plants Care - AI-Powered Plant Care App

A beautiful, futuristic React Native mobile app that helps you care for your plants using AI and image recognition.

> **Note:** This project started as a different app but changed direction. This is the Plants Care app - version 1.0.

## Features

- 📸 **Plant Identification**: Take photos and identify plants using Perenual and Kindwise APIs
- 🤖 **AI Care Assistant**: Get personalized care advice using OpenAI GPT
- 🌡️ **Weather Integration**: Location-based care recommendations with OpenWeatherMap
- 📱 **CRUD Operations**: Save, manage, and track all your plants
- 🎨 **Futuristic Design**: Modern UI with gradients, animations, and smooth transitions
- 📊 **Plant Health Monitoring**: Detect issues and get solutions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):
```
PERENUAL_API_KEY=your_perenual_api_key
KINDWISE_API_KEY=your_kindwise_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=your_openai_api_key
```

3. Start the app:
```bash
npm start
```

## API Keys Required

- Perenual API Key
- Kindwise API Key
- OpenWeatherMap API Key
- OpenAI API Key

## Tech Stack

- React Native with Expo
- React Navigation
- AsyncStorage for local data
- Axios for API calls
- React Native Reanimated for animations
- Expo Camera for photo capture
