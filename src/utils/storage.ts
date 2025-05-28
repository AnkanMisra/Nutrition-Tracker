import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ConsumedFood } from '../types';

const DAILY_LOG_KEY = 'daily_food_log';

// Get today's date in YYYY-MM-DD format
const getTodayKey = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to detect if running on web
const isWeb = Platform.OS === 'web';

// Get today's food log
export const getTodayLog = async (): Promise<ConsumedFood[]> => {
  try {
    const todayKey = getTodayKey();
    const jsonValue = await AsyncStorage.getItem(`${DAILY_LOG_KEY}_${todayKey}`);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    if (isWeb) {
      console.error('Error reading daily log on web platform:', e);
      // For web, we could implement a fallback to localStorage if needed
      const fallbackData = localStorage.getItem(`${DAILY_LOG_KEY}_${getTodayKey()}`);
      if (fallbackData) {
        try {
          return JSON.parse(fallbackData);
        } catch {
          return [];
        }
      }
    } else {
      console.error('Error reading daily log:', e);
    }
    return [];
  }
};

// Save today's food log
export const saveTodayLog = async (foodLog: ConsumedFood[]): Promise<void> => {
  try {
    const todayKey = getTodayKey();
    const jsonValue = JSON.stringify(foodLog);
    await AsyncStorage.setItem(`${DAILY_LOG_KEY}_${todayKey}`, jsonValue);

    // For web, also save to localStorage as a fallback
    if (isWeb) {
      try {
        localStorage.setItem(`${DAILY_LOG_KEY}_${todayKey}`, jsonValue);
      } catch (webError) {
        console.warn('Failed to save to localStorage fallback:', webError);
      }
    }
  } catch (e) {
    console.error('Error saving daily log:', e);

    // Attempt to use localStorage as fallback on web
    if (isWeb) {
      try {
        const todayKey = getTodayKey();
        localStorage.setItem(`${DAILY_LOG_KEY}_${todayKey}`, JSON.stringify(foodLog));
      } catch (webError) {
        console.error('Both AsyncStorage and localStorage fallback failed:', webError);
      }
    }
  }
};

// Add food to today's log
export const addFoodToLog = async (food: Omit<ConsumedFood, 'id'>): Promise<ConsumedFood[]> => {
  try {
    const currentLog = await getTodayLog();
    const newFood: ConsumedFood = { ...food, id: Date.now().toString() };
    const newLog = [...currentLog, newFood];
    await saveTodayLog(newLog);
    return newLog;
  } catch (e) {
    console.error('Error adding food to log:', e);
    return [];
  }
};

// Remove food from today's log
export const removeFoodFromLog = async (foodId: string): Promise<ConsumedFood[]> => {
  try {
    const currentLog = await getTodayLog();
    const newLog = currentLog.filter(food => food.id !== foodId);
    await saveTodayLog(newLog);
    return newLog;
  } catch (e) {
    console.error('Error removing food from log:', e);
    return [];
  }
};

// Clear today's log
export const clearTodayLog = async (): Promise<ConsumedFood[]> => {
  try {
    const todayKey = getTodayKey();
    await AsyncStorage.removeItem(`${DAILY_LOG_KEY}_${todayKey}`);

    // Also clear from localStorage on web
    if (isWeb) {
      try {
        localStorage.removeItem(`${DAILY_LOG_KEY}_${todayKey}`);
      } catch (webError) {
        console.warn('Failed to clear from localStorage fallback:', webError);
      }
    }

    return [];
  } catch (e) {
    console.error('Error clearing daily log:', e);

    // Try fallback on web
    if (isWeb) {
      try {
        const todayKey = getTodayKey();
        localStorage.removeItem(`${DAILY_LOG_KEY}_${todayKey}`);
      } catch (webError) {
        console.error('Both AsyncStorage and localStorage fallback failed when clearing:', webError);
      }
    }

    return [];
  }
}; 