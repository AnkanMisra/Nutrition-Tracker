// Note: You'll need to get a free API key from https://fdc.nal.usda.gov/api-key-signup.html
// Temporarily using DEMO_KEY for testing as there might be an issue with the provided key
const API_KEY = 'DEMO_KEY';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

import axios from 'axios';

// Search for foods with retry logic
export const searchFoods = async (query) => {
  // Maximum number of retry attempts
  const MAX_RETRIES = 2;
  let retries = 0;

  // Retry function
  const attemptSearch = async () => {
    try {
      // Using POST request as recommended in the API documentation
      const response = await axios.post(
        `${BASE_URL}/foods/search?api_key=${API_KEY}`,
        {
          query: query,
          pageSize: 10,
          dataType: ["Branded", "Foundation", "Survey (FNDDS)", "SR Legacy"] // Include all data types
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      return response.data.foods.map(food => ({
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner || '',
        dataType: food.dataType,
        servingSize: food.servingSize || 100,
        servingSizeUnit: food.servingSizeUnit || 'g'
      }));
    } catch (error) {
      console.error('Error searching foods:', error);

      // Check if we should retry
      if (retries < MAX_RETRIES &&
        (error.code === 'ECONNABORTED' ||
          (error.response && (error.response.status === 500 || error.response.status === 503)))) {
        retries++;
        console.log(`Retrying search (${retries}/${MAX_RETRIES})...`);
        // Exponential backoff: wait longer between each retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        return attemptSearch();
      }

      // Provide more specific error messages based on status code
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 500) {
          throw new Error('Server error. The USDA API may be experiencing issues or the API key may have reached its limit.');
        } else if (error.response.status === 503) {
          throw new Error('The USDA API service is temporarily unavailable. Please try again later.');
        } else if (error.response.status === 403) {
          throw new Error('API key error. Please check your API key or get a new one from the USDA website.');
        } else if (error.response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (error.response.status === 400) {
          throw new Error('Invalid request. Please check your search parameters.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response from server. Please check your internet connection.');
      }

      // Generic error message as fallback
      throw new Error('Failed to search foods. Please try again.');
    }
  };

  // Initial attempt
  return attemptSearch();
};

// Get detailed nutrition information for a specific food
export const getFoodDetails = async (fdcId) => {
  try {
    const response = await axios.get(`${BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: API_KEY
      },
      timeout: 10000 // 10 second timeout
    });

    const food = response.data;
    const nutrients = {};

    // Extract key nutrients
    food.foodNutrients.forEach(nutrient => {
      const name = nutrient.nutrient.name.toLowerCase();
      const value = nutrient.amount || 0;

      if (name.includes('energy') || name.includes('calorie')) {
        nutrients.calories = Math.round(value);
      } else if (name.includes('protein')) {
        nutrients.protein = Math.round(value * 100) / 100;
      } else if (name.includes('carbohydrate')) {
        nutrients.carbohydrates = Math.round(value * 100) / 100;
      } else if (name.includes('total lipid') || name.includes('fat')) {
        nutrients.fat = Math.round(value * 100) / 100;
      } else if (name.includes('fiber')) {
        nutrients.fiber = Math.round(value * 100) / 100;
      } else if (name.includes('sugars')) {
        nutrients.sugar = Math.round(value * 100) / 100;
      } else if (name.includes('sodium')) {
        nutrients.sodium = Math.round(value * 100) / 100;
      }
    });

    return {
      fdcId: food.fdcId,
      description: food.description,
      brandOwner: food.brandOwner || '',
      servingSize: food.servingSize || 100,
      servingSizeUnit: food.servingSizeUnit || 'g',
      nutrients: {
        calories: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbohydrates: nutrients.carbohydrates || 0,
        fat: nutrients.fat || 0,
        fiber: nutrients.fiber || 0,
        sugar: nutrients.sugar || 0,
        sodium: nutrients.sodium || 0
      }
    };
  } catch (error) {
    console.error('Error getting food details:', error);
    throw new Error('Failed to get food details. Please try again.');
  }
};

// Calculate nutrition for a specific quantity
export const calculateNutrition = (foodNutrients, quantity, servingSize = 100) => {
  const multiplier = quantity / servingSize;

  return {
    calories: Math.round(foodNutrients.calories * multiplier),
    protein: Math.round(foodNutrients.protein * multiplier * 100) / 100,
    carbohydrates: Math.round(foodNutrients.carbohydrates * multiplier * 100) / 100,
    fat: Math.round(foodNutrients.fat * multiplier * 100) / 100,
    fiber: Math.round(foodNutrients.fiber * multiplier * 100) / 100,
    sugar: Math.round(foodNutrients.sugar * multiplier * 100) / 100,
    sodium: Math.round(foodNutrients.sodium * multiplier * 100) / 100
  };
};
