import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Paragraph,
  Text,
  TextInput,
  Title
} from 'react-native-paper';
import { calculateNutrition, getFoodDetails } from '../services/foodApi';
import { addFoodToLog } from '../utils/storage';
import { FoodItem, FoodSearchResult, Nutrients, RootStackParamList } from '../types';

type FoodDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FoodDetails'>;
type FoodDetailsScreenRouteProp = RouteProp<RootStackParamList, 'FoodDetails'>;

interface Props {
  navigation: FoodDetailsScreenNavigationProp;
  route: FoodDetailsScreenRouteProp;
}

const FoodDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { food } = route.params;
  const [foodDetails, setFoodDetails] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<string>('100');
  const [calculatedNutrients, setCalculatedNutrients] = useState<Nutrients | null>(null);
  const [adding, setAdding] = useState<boolean>(false);

  // Load food details when component mounts
  useEffect(() => {
    loadFoodDetails();
  }, []);

  // Recalculate nutrition when quantity changes
  useEffect(() => {
    if (foodDetails && quantity) {
      const calculated = calculateNutrition(
        foodDetails.nutrients,
        parseFloat(quantity) || 0,
        foodDetails.servingSize
      );
      setCalculatedNutrients(calculated);
    }
  }, [foodDetails, quantity]);

  // Load detailed nutrition information
  const loadFoodDetails = async (): Promise<void> => {
    try {
      const details = await getFoodDetails(food.fdcId);
      setFoodDetails(details);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load food details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Add food to daily log
  const handleAddToLog = async (): Promise<void> => {
    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (!foodDetails || !calculatedNutrients) {
      Alert.alert('Error', 'Food details not loaded');
      return;
    }

    setAdding(true);

    try {
      const foodToAdd = {
        food: foodDetails,
        quantity: parseFloat(quantity),
        consumedAt: new Date().toISOString(),
        calculatedNutrients: calculatedNutrients
      };

      await addFoodToLog(foodToAdd);

      Alert.alert(
        'Success',
        'Food added to your daily log!',
        [
          {
            text: 'Add Another',
            onPress: () => navigation.goBack()
          },
          {
            text: 'View Log',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add food to log');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading nutrition information...</Text>
      </View>
    );
  }

  if (!foodDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load food details</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Food Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.foodTitle}>{foodDetails.description}</Title>
          {foodDetails.brandOwner && (
            <Paragraph style={styles.brand}>{foodDetails.brandOwner}</Paragraph>
          )}
          <Paragraph style={styles.servingInfo}>
            Nutrition per {foodDetails.servingSize}{foodDetails.servingSizeUnit}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Quantity Input */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quantity</Title>
          <TextInput
            label={`Amount (${foodDetails.servingSizeUnit})`}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            mode="outlined"
            style={styles.quantityInput}
            outlineColor="#6200ee"
            activeOutlineColor="#6200ee"
          />
        </Card.Content>
      </Card>

      {/* Calculated Nutrition */}
      {calculatedNutrients && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Nutrition Information</Title>
            <Text style={styles.subtitle}>
              For {quantity}{foodDetails.servingSizeUnit}
            </Text>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={[styles.nutritionValue, styles.caloriesValue]}>{calculatedNutrients.calories}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={[styles.nutritionValue, styles.proteinValue]}>{calculatedNutrients.protein}g</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Carbohydrates</Text>
                <Text style={[styles.nutritionValue, styles.carbsValue]}>{calculatedNutrients.carbohydrates}g</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={[styles.nutritionValue, styles.fatValue]}>{calculatedNutrients.fat}g</Text>
              </View>

              {calculatedNutrients.fiber > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Fiber</Text>
                    <Text style={[styles.nutritionValue, styles.fiberValue]}>{calculatedNutrients.fiber}g</Text>
                  </View>
                </>
              )}

              {calculatedNutrients.sugar > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sugar</Text>
                    <Text style={[styles.nutritionValue, styles.sugarValue]}>{calculatedNutrients.sugar}g</Text>
                  </View>
                </>
              )}

              {calculatedNutrients.sodium > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>Sodium</Text>
                    <Text style={[styles.nutritionValue, styles.sodiumValue]}>{calculatedNutrients.sodium}mg</Text>
                  </View>
                </>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Add to Log Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleAddToLog}
          loading={adding}
          disabled={adding || !quantity || parseFloat(quantity) <= 0}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
          labelStyle={styles.addButtonLabel}
        >
          Add to Daily Log
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4
  },
  foodTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333'
  },
  brand: {
    color: '#666',
    fontStyle: 'italic'
  },
  servingInfo: {
    color: '#666',
    fontSize: 12,
    marginTop: 4
  },
  quantityInput: {
    marginTop: 8,
    backgroundColor: '#fff'
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16
  },
  nutritionGrid: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500'
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  caloriesValue: {
    color: '#e91e63'
  },
  proteinValue: {
    color: '#2196f3'
  },
  carbsValue: {
    color: '#ff9800'
  },
  fatValue: {
    color: '#f44336'
  },
  fiberValue: {
    color: '#4caf50'
  },
  sugarValue: {
    color: '#9c27b0'
  },
  sodiumValue: {
    color: '#607d8b'
  },
  divider: {
    backgroundColor: '#e0e0e0',
    height: 1
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32
  },
  addButton: {
    borderRadius: 8,
    elevation: 4,
    backgroundColor: '#6200ee'
  },
  addButtonContent: {
    paddingVertical: 8,
    height: 56
  },
  addButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default FoodDetailsScreen; 