import axios from 'axios';
import { API_KEYS, API_ENDPOINTS } from '../config/api';
import { imageToBase64 } from '../utils/imageUtils';

// Identify plant using Kindwise API
export const identifyPlantWithKindwise = async (imageUri) => {
  try {
    const base64Image = await imageToBase64(imageUri);
    
    // Kindwise API v3 format - minimal request with only required fields
    const requestBody = {
      images: [base64Image],
    };
    
    console.log('Sending Kindwise API request with:', {
      endpoint: API_ENDPOINTS.KINDWISE,
      hasImage: !!base64Image,
      imageLength: base64Image?.length || 0,
    });
    
    const response = await axios.post(
      API_ENDPOINTS.KINDWISE,
      requestBody,
      {
        headers: {
          'Api-Key': API_KEYS.KINDWISE,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('Kindwise API response:', {
      status: response.status,
      hasData: !!response.data,
      hasResult: !!response.data?.result,
      hasClassification: !!response.data?.result?.classification,
      classificationCount: response.data?.result?.classification?.suggestions?.length || 0,
      result: response.data,
    });

    return response.data;
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error('Kindwise API error:', errorDetails);
    console.error('Full error:', error);
    // If API fails, return null instead of throwing to allow fallback
    return null;
  }
};

// Get plant details from Perenual API
export const getPlantDetails = async (plantName) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.PERENUAL}/species-list`,
      {
        params: {
          key: API_KEYS.PERENUAL,
          q: plantName,
        },
      }
    );

    if (response.data && response.data.data && response.data.data.length > 0) {
      const plantId = response.data.data[0].id;
      const detailsResponse = await axios.get(
        `${API_ENDPOINTS.PERENUAL}/species/details/${plantId}`,
        {
          params: {
            key: API_KEYS.PERENUAL,
          },
        }
      );
      return detailsResponse.data;
    }
    return null;
  } catch (error) {
    console.error('Perenual API error:', error);
    throw error;
  }
};

// Combined plant identification
export const identifyPlant = async (imageUri) => {
  try {
    // Try Kindwise first
    const kindwiseResult = await identifyPlantWithKindwise(imageUri);
    
    console.log('Processing Kindwise result:', {
      hasResult: !!kindwiseResult,
      status: kindwiseResult?.status,
      hasClassification: !!kindwiseResult?.result?.classification,
      classificationKeys: kindwiseResult?.result?.classification ? Object.keys(kindwiseResult.result.classification) : [],
    });
    
    // Kindwise API v3 uses result.classification.suggestions structure
    const suggestions = kindwiseResult?.result?.classification?.suggestions || 
                       kindwiseResult?.result?.classification || 
                       [];
    
    console.log('Found suggestions:', {
      count: suggestions.length,
      suggestions: suggestions,
    });
    
    if (suggestions && suggestions.length > 0) {
      const topSuggestion = suggestions[0];
      console.log('Top suggestion:', {
        name: topSuggestion.name,
        probability: topSuggestion.probability,
        details: topSuggestion.details,
        suggestionKeys: Object.keys(topSuggestion),
      });
      
      // Extract plant name from v3 API structure
      const plantName = topSuggestion.name || 
                       topSuggestion.details?.common_names?.[0] ||
                       topSuggestion.scientific_name ||
                       topSuggestion.details?.scientific_name ||
                       'Unknown Plant';
      
      console.log('Extracted plant name:', plantName);
      
      // Get detailed info from Perenual (don't fail if this doesn't work)
      let perenualDetails = null;
      try {
        perenualDetails = await getPlantDetails(plantName);
      } catch (perenualError) {
        console.warn('Perenual API error (non-fatal):', perenualError);
      }
      
      const result = {
        name: plantName,
        confidence: topSuggestion.probability || 0,
        kindwiseData: topSuggestion,
        perenualData: perenualDetails,
        wikiDescription: topSuggestion.details?.wiki_description?.value || 
                        topSuggestion.details?.description?.value,
      };
      
      console.log('Returning plant identification result:', result);
      return result;
    }
    
    console.log('No suggestions found, returning unknown plant');
    // If Kindwise fails, return a basic response
    return {
      name: 'Unknown Plant',
      confidence: 0,
      kindwiseData: kindwiseResult,
      perenualData: null,
      wikiDescription: null,
    };
  } catch (error) {
    console.error('Plant identification error:', error);
    // Return a basic response instead of throwing
    return {
      name: 'Unknown Plant',
      confidence: 0,
      kindwiseData: null,
      perenualData: null,
      wikiDescription: null,
    };
  }
};

