import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/api';

// Get AI-powered care advice
export const getCareAdvice = async (plantName, plantDetails, weatherData) => {
  try {
    const prompt = `You are an expert botanist. Provide detailed care instructions for a ${plantName} plant.
    
Plant Details: ${JSON.stringify(plantDetails, null, 2)}
Current Weather: ${weatherData ? `Temperature: ${weatherData.temp}°C, Humidity: ${weatherData.humidity}%, Conditions: ${weatherData.conditions}` : 'Not available'}

Please provide:
1. Watering schedule and amount
2. Light requirements
3. Temperature preferences
4. Soil type and fertilization needs
5. Common issues and how to prevent them
6. Seasonal care tips

Format your response in a friendly, easy-to-understand way.`;

    const response = await axios.post(
      API_ENDPOINTS.OPENAI,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful plant care expert. Provide clear, actionable advice.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

// Detect plant issues from image
export const detectPlantIssues = async (imageUri, plantName) => {
  try {
    // Note: This would require OpenAI Vision API or similar
    // For now, we'll use a text-based approach
    const prompt = `Analyze this plant image and identify any potential issues. The plant is a ${plantName}.
    
Look for:
- Yellowing or browning leaves
- Pests or insects
- Fungal infections
- Overwatering or underwatering signs
- Nutrient deficiencies
- Light-related problems

Provide specific solutions for any issues you identify.`;

    const response = await axios.post(
      API_ENDPOINTS.OPENAI,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a plant disease and health expert. Analyze plant conditions and provide solutions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI issue detection error:', error);
    throw error;
  }
};

// Get personalized care tips
export const getPersonalizedTips = async (plantName, userLocation, season) => {
  try {
    const prompt = `Provide personalized care tips for a ${plantName} in ${userLocation} during ${season}.
    Consider local climate, seasonal changes, and best practices for this specific location and time of year.`;

    const response = await axios.post(
      API_ENDPOINTS.OPENAI,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a local plant care expert. Provide location-specific advice.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.OPENAI}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI tips error:', error);
    throw error;
  }
};

