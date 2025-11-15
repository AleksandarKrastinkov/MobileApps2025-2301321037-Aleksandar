// Utility functions for image handling
import * as FileSystemLegacy from 'expo-file-system/legacy';

// Convert image URI to base64 for React Native
export const imageToBase64 = async (uri) => {
  try {
    // Use legacy API - EncodingType might not exist, use string directly
    let base64;
    try {
      base64 = await FileSystemLegacy.readAsStringAsync(uri, {
        encoding: FileSystemLegacy.EncodingType?.Base64 || 'base64',
      });
    } catch (e) {
      // If EncodingType doesn't exist, use string
      base64 = await FileSystemLegacy.readAsStringAsync(uri, {
        encoding: 'base64',
      });
    }
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    // Fallback: try using fetch approach (works on mobile)
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (fetchError) {
      console.error('All methods failed:', fetchError);
      throw new Error('Failed to convert image to base64');
    }
  }
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

