import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Card,
  FAB,
  IconButton,
  List,
  Paragraph,
  Surface,
  Text,
  Title
} from 'react-native-paper';
import { clearTodayLog, getTodayLog, removeFoodFromLog } from '../utils/storage';
import { ConsumedFood, RootStackParamList } from '../types';

interface NutritionTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [foodLog, setFoodLog] = useState<ConsumedFood[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [totals, setTotals] = useState<NutritionTotals>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0
  });

  // Load today's food log
  const loadFoodLog = async (): Promise<void> => {
    try {
      const log = await getTodayLog();
      setFoodLog(log);
      calculateTotals(log);
    } catch (error) {
      console.error('Error loading food log:', error);
    }
  };

  // Calculate nutrition totals
  const calculateTotals = (log: ConsumedFood[]): void => {
    const newTotals = log.reduce(
      (acc, food) => ({
        calories: acc.calories + (food.calculatedNutrients?.calories || 0),
        protein: acc.protein + (food.calculatedNutrients?.protein || 0),
        carbohydrates: acc.carbohydrates + (food.calculatedNutrients?.carbohydrates || 0),
        fat: acc.fat + (food.calculatedNutrients?.fat || 0)
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }
    );

    setTotals({
      calories: Math.round(newTotals.calories),
      protein: Math.round(newTotals.protein * 100) / 100,
      carbohydrates: Math.round(newTotals.carbohydrates * 100) / 100,
      fat: Math.round(newTotals.fat * 100) / 100
    });
  };

  // Remove food from log
  const handleRemoveFood = async (foodId: string): Promise<void> => {
    try {
      const updatedLog = await removeFoodFromLog(foodId);
      setFoodLog(updatedLog);
      calculateTotals(updatedLog);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove food from log');
    }
  };

  // Clear entire log
  const handleClearLog = (): void => {
    Alert.alert(
      'Clear Daily Log',
      'Are you sure you want to clear all foods from today\'s log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearTodayLog();
              setFoodLog([]);
              setTotals({ calories: 0, protein: 0, carbohydrates: 0, fat: 0 });
            } catch (error) {
              Alert.alert('Error', 'Failed to clear log');
            }
          }
        }
      ]
    );
  };

  // Refresh handler
  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await loadFoodLog();
    setRefreshing(false);
  }, []);

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFoodLog();
    }, [])
  );

  const getTodayDate = (): string => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6200ee']} />
        }
      >
        {/* Date Header */}
        <Card style={styles.dateCard}>
          <Card.Content>
            <Title style={styles.dateTitle}>{getTodayDate()}</Title>
          </Card.Content>
        </Card>

        {/* Nutrition Totals */}
        <Card style={styles.totalsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Today's Nutrition</Title>
            <View style={styles.totalsGrid}>
              <Surface style={styles.totalItem}>
                <Text style={[styles.totalValue, styles.caloriesValue]}>{totals.calories}</Text>
                <Text style={styles.totalLabel}>Calories</Text>
              </Surface>
              <Surface style={styles.totalItem}>
                <Text style={[styles.totalValue, styles.proteinValue]}>{totals.protein}g</Text>
                <Text style={styles.totalLabel}>Protein</Text>
              </Surface>
              <Surface style={styles.totalItem}>
                <Text style={[styles.totalValue, styles.carbsValue]}>{totals.carbohydrates}g</Text>
                <Text style={styles.totalLabel}>Carbs</Text>
              </Surface>
              <Surface style={styles.totalItem}>
                <Text style={[styles.totalValue, styles.fatValue]}>{totals.fat}g</Text>
                <Text style={styles.totalLabel}>Fat</Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Food Log */}
        <Card style={styles.logCard}>
          <Card.Content>
            <View style={styles.logHeader}>
              <Title style={styles.sectionTitle}>Food Log</Title>
              {foodLog.length > 0 && (
                <Button
                  mode="outlined"
                  onPress={handleClearLog}
                  compact
                  textColor="#d32f2f"
                  style={styles.clearButton}
                >
                  Clear All
                </Button>
              )}
            </View>

            {foodLog.length === 0 ? (
              <View style={styles.emptyState}>
                <Paragraph style={styles.emptyText}>
                  No foods logged today. Tap the + button to add your first meal!
                </Paragraph>
              </View>
            ) : (
              foodLog.map((food) => (
                <Surface key={food.id} style={styles.foodItemSurface}>
                  <List.Item
                    title={<Text style={styles.foodItemTitle}>{food.food.description}</Text>}
                    description={
                      <View style={styles.foodItemDetails}>
                        <Text style={styles.foodItemQuantity}>{food.quantity}{food.food.servingSizeUnit}</Text>
                        <Text style={styles.foodItemCalories}>{food.calculatedNutrients?.calories || 0} cal</Text>
                      </View>
                    }
                    right={() => (
                      <IconButton
                        icon="delete"
                        onPress={() => handleRemoveFood(food.id)}
                        iconColor="#d32f2f"
                        style={styles.deleteButton}
                      />
                    )}
                    style={styles.foodItem}
                  />
                </Surface>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Search')}
        label="Add Food"
        color="#fff"
        theme={{ colors: { accent: '#6200ee' } }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  dateCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4
  },
  dateTitle: {
    textAlign: 'center',
    color: '#6200ee',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold'
  },
  totalsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4
  },
  totalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16
  },
  totalItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
    minWidth: 70
  },
  totalValue: {
    fontSize: 24,
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
  totalLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  logCard: {
    marginBottom: 100,
    borderRadius: 12,
    elevation: 4
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  clearButton: {
    borderColor: '#d32f2f',
    borderRadius: 8
  },
  emptyState: {
    padding: 32,
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic'
  },
  foodItemSurface: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: '#fff'
  },
  foodItem: {
    padding: 4
  },
  foodItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  foodItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  foodItemQuantity: {
    fontSize: 14,
    color: '#666'
  },
  foodItemCalories: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '500'
  },
  deleteButton: {
    margin: 0
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
    borderRadius: 28,
    elevation: 6
  }
});

export default HomeScreen; 