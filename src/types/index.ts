// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  FoodDetails: { food: FoodSearchResult };
};

// Food API types
export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner: string;
  dataType: string;
  servingSize: number;
  servingSizeUnit: string;
}

export interface Nutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface FoodItem {
  fdcId: number;
  description: string;
  brandOwner: string;
  servingSize: number;
  servingSizeUnit: string;
  nutrients: Nutrients;
}

// Storage types
export interface ConsumedFood {
  id: string;
  food: FoodItem;
  quantity: number;
  consumedAt: string;
  calculatedNutrients: Nutrients;
}

export interface DailyNutrition {
  date: string;
  totalNutrients: Nutrients;
  foods: ConsumedFood[];
}

// API Response types
export interface USDAFoodNutrient {
  nutrient: {
    name: string;
    unitName: string;
  };
  amount: number;
}

export interface USDAFoodResponse {
  fdcId: number;
  description: string;
  brandOwner?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: USDAFoodNutrient[];
}

export interface USDASearchResponse {
  foods: Array<{
    fdcId: number;
    description: string;
    brandOwner?: string;
    dataType: string;
    servingSize?: number;
    servingSizeUnit?: string;
  }>;
}

// Component Props types
export interface NutritionCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
  icon: string;
}

export interface FoodCardProps {
  food: ConsumedFood;
  onPress: () => void;
  onDelete: () => void;
}

export interface SearchResultProps {
  food: FoodSearchResult;
  onPress: () => void;
} 