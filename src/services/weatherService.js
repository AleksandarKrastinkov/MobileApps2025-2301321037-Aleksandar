import axios from 'axios';
import * as Location from 'expo-location';
import { API_KEYS, API_ENDPOINTS } from '../config/api';

// Get current weather based on location
export const getCurrentWeather = async () => {
  try {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Get weather data
    const response = await axios.get(
      `${API_ENDPOINTS.OPENWEATHER}/weather`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEYS.OPENWEATHER,
          units: 'metric',
        },
      }
    );

    return {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].main,
      description: response.data.weather[0].description,
      windSpeed: response.data.wind?.speed || 0,
      location: {
        lat: latitude,
        lon: longitude,
        city: response.data.name,
      },
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

// Get weather forecast
export const getWeatherForecast = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const response = await axios.get(
      `${API_ENDPOINTS.OPENWEATHER}/forecast`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEYS.OPENWEATHER,
          units: 'metric',
        },
      }
    );

    return response.data.list.slice(0, 5).map((item) => ({
      date: item.dt_txt,
      temp: item.main.temp,
      conditions: item.weather[0].main,
      humidity: item.main.humidity,
    }));
  } catch (error) {
    console.error('Weather forecast error:', error);
    throw error;
  }
};

