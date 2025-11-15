// API Configuration
// Import environment variables from .env file
import {
  PERENUAL_API_KEY,
  KINDWISE_API_KEY,
  OPENWEATHER_API_KEY,
  OPENAI_API_KEY,
} from '@env';

export const API_KEYS = {
  PERENUAL: PERENUAL_API_KEY || '',
  KINDWISE: KINDWISE_API_KEY || '',
  OPENWEATHER: OPENWEATHER_API_KEY || '',
  OPENAI: OPENAI_API_KEY || '',
};

export const API_ENDPOINTS = {
  PERENUAL: 'https://perenual.com/api',
  KINDWISE: 'https://api.plant.id/v3/identification',
  OPENWEATHER: 'https://api.openweathermap.org/data/2.5',
  OPENAI: 'https://api.openai.com/v1/chat/completions',
};

