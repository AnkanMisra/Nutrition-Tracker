// Note: You'll need to get a free API key from https://fdc.nal.usda.gov/api-key-signup.html
// Temporarily using DEMO_KEY for testing as there might be an issue with the provided key
const API_KEY = 'DEMO_KEY';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

import axios, { AxiosResponse } from 'axios';
import { 
  FoodSearchResult, 
  FoodItem, 
  Nutrients, 
  USDASearchResponse, 
  USDAFoodResponse 
} from '../types';

// Search for foods with retry logic
export const searchFoods = async (query: string): Promise<FoodSearchResult[]> => {
  // Maximum number of retry attempts
  const MAX_RETRIES = 2;
  let retries = 0;

  // Retry function
  const attemptSearch = async (): Promise<FoodSearchResult[]> => {
    try {
      // Using POST request as recommended in the API documentation
      const response: AxiosResponse<USDASearchResponse> = await axios.post(
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
    } catch (error: any) {
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
export const getFoodDetails = async (fdcId: number): Promise<FoodItem> => {
  try {
    const response: AxiosResponse<USDAFoodResponse> = await axios.get(`${BASE_URL}/food/${fdcId}`, {
      params: {
        api_key: API_KEY
      },
      timeout: 10000 // 10 second timeout
    });

    const food = response.data;
    const nutrients: Partial<Nutrients> = {};

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
  } catch (error: any) {
    console.error('Error getting food details:', error);
    throw new Error('Failed to get food details. Please try again.');
  }
};

// Calculate nutrition for a specific quantity
export const calculateNutrition = (foodNutrients: Nutrients, quantity: number, servingSize: number = 100): Nutrients => {
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

// Search for food by barcode using multiple databases
export const searchFoodByBarcode = async (barcode: string): Promise<FoodSearchResult | null> => {
  try {
    // First try USDA FoodData Central (supports some international products)
    const usdaResult = await searchUSDAByBarcode(barcode);
    if (usdaResult) {
      return usdaResult;
    }

    // Then try Open Food Facts (great for Indian and international products)
    const offResult = await searchOpenFoodFactsByBarcode(barcode);
    if (offResult) {
      return offResult;
    }

    // If no results found
    return null;
  } catch (error) {
    console.error('Error searching by barcode:', error);
    throw new Error('Failed to search by barcode. Please try again.');
  }
};

// Search USDA database by barcode (limited barcode support)
const searchUSDAByBarcode = async (barcode: string): Promise<FoodSearchResult | null> => {
  try {
    // USDA doesn't have direct barcode search, so we search by UPC in the query
    const response: AxiosResponse<USDASearchResponse> = await axios.post(
      `${BASE_URL}/foods/search?api_key=${API_KEY}`,
      {
        query: barcode,
        pageSize: 5,
        dataType: ["Branded"] // Only branded foods have barcodes
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data.foods && response.data.foods.length > 0) {
      const food = response.data.foods[0];
      return {
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner || '',
        dataType: food.dataType,
        servingSize: food.servingSize || 100,
        servingSizeUnit: food.servingSizeUnit || 'g'
      };
    }

    return null;
  } catch (error) {
    console.error('USDA barcode search error:', error);
    return null;
  }
};

// Search Open Food Facts database by barcode (excellent for Indian products)
const searchOpenFoodFactsByBarcode = async (barcode: string): Promise<FoodSearchResult | null> => {
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      timeout: 10000
    });

    if (response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      
      // Extract nutrition data
      const nutrients = product.nutriments || {};
      
      return {
        fdcId: parseInt(barcode), // Use barcode as ID for OFF products
        description: product.product_name || product.product_name_en || 'Unknown Product',
        brandOwner: product.brands || '',
        dataType: 'Open Food Facts',
        servingSize: parseFloat(product.serving_size) || 100,
        servingSizeUnit: product.serving_size_unit || 'g'
      };
    }

    return null;
  } catch (error) {
    console.error('Open Food Facts barcode search error:', error);
    return null;
  }
};

// Get detailed nutrition from Open Food Facts
export const getOpenFoodFactsDetails = async (barcode: string): Promise<FoodItem | null> => {
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
      timeout: 10000
    });

    if (response.data.status === 1 && response.data.product) {
      const product = response.data.product;
      const nutrients = product.nutriments || {};
      
      // Convert per 100g values to our format
      const nutrition: Nutrients = {
        calories: Math.round(nutrients.energy_100g || nutrients['energy-kcal_100g'] || 0),
        protein: Math.round((nutrients.proteins_100g || 0) * 100) / 100,
        carbohydrates: Math.round((nutrients.carbohydrates_100g || 0) * 100) / 100,
        fat: Math.round((nutrients.fat_100g || 0) * 100) / 100,
        fiber: Math.round((nutrients.fiber_100g || 0) * 100) / 100,
        sugar: Math.round((nutrients.sugars_100g || 0) * 100) / 100,
        sodium: Math.round((nutrients.sodium_100g || 0) * 100) / 100
      };

      return {
        fdcId: parseInt(barcode),
        description: product.product_name || product.product_name_en || 'Unknown Product',
        brandOwner: product.brands || '',
        servingSize: parseFloat(product.serving_size) || 100,
        servingSizeUnit: product.serving_size_unit || 'g',
        nutrients: nutrition
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting Open Food Facts details:', error);
    return null;
  }
}; 