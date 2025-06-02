import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Animated,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  Button,
  Card,
  FAB,
  IconButton,
  Surface,
  Text,
  ProgressBar,
  Menu,
  Divider,
  Chip
} from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { clearTodayLog, getTodayLog, removeFoodFromLog } from '../utils/storage';
import { ConsumedFood, RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NutritionTotals {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [foodLog, setFoodLog] = useState<ConsumedFood[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [animatedValue] = useState(new Animated.Value(0));
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [totals, setTotals] = useState<NutritionTotals>({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });

  // Daily goals (MyFitnessPal style)
  const goals = {
    calories: 2000,
    protein: 150,
    carbohydrates: 250,
    fat: 65,
    fiber: 25,
    sugar: 50,
    sodium: 2300
  };

  // Load today's food log
  const loadFoodLog = async (): Promise<void> => {
    try {
      const log = await getTodayLog();
      setFoodLog(log);
      calculateTotals(log);
      
      // Animate on load
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
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
        fat: acc.fat + (food.calculatedNutrients?.fat || 0),
        fiber: acc.fiber + (food.calculatedNutrients?.fiber || 0),
        sugar: acc.sugar + (food.calculatedNutrients?.sugar || 0),
        sodium: acc.sodium + (food.calculatedNutrients?.sodium || 0)
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
    );

    setTotals({
      calories: Math.round(newTotals.calories),
      protein: Math.round(newTotals.protein * 100) / 100,
      carbohydrates: Math.round(newTotals.carbohydrates * 100) / 100,
      fat: Math.round(newTotals.fat * 100) / 100,
      fiber: Math.round(newTotals.fiber * 100) / 100,
      sugar: Math.round(newTotals.sugar * 100) / 100,
      sodium: Math.round(newTotals.sodium * 100) / 100
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
              setTotals({ calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 });
            } catch (error) {
              Alert.alert('Error', 'Failed to clear log');
            }
          }
        }
      ]
    );
  };

  // Settings menu handler
  const handleSettings = (): void => {
    setSettingsVisible(false);
    Alert.alert(
      'Settings',
      'Choose an option:',
      [
        { text: 'Edit Goals', onPress: () => handleEditGoals() },
        { text: 'Export Data', onPress: () => handleExportData() },
        { text: 'Clear All Data', onPress: () => handleClearLog() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Edit goals handler
  const handleEditGoals = (): void => {
    Alert.alert('Edit Goals', 'Goal editing feature coming soon!');
  };

  // Export data handler
  const handleExportData = (): void => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  // Calendar handler
  const handleCalendar = (): void => {
    Alert.alert('Calendar', 'Date selection feature coming soon!');
  };

  // Quick add handlers
  const handleQuickAdd = (mealType: string): void => {
    navigation.navigate('Search');
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
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCaloriesRemaining = (): number => {
    return Math.max(0, goals.calories - totals.calories);
  };

  const getCaloriesProgress = (): number => {
    return Math.min(totals.calories / goals.calories, 1);
  };

  const CircularProgressItem: React.FC<{
    value: number;
    maxValue: number;
    label: string;
    unit: string;
    color: string;
  }> = ({ value, maxValue, label, unit, color }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    
    return (
      <TouchableOpacity style={styles.circularProgressContainer}>
        <AnimatedCircularProgress
          size={85}
          width={8}
          fill={percentage}
          tintColor={color}
          backgroundColor={colors.border}
          rotation={0}
          lineCap="round"
          duration={1000}
        >
          {() => (
            <View style={styles.circularProgressContent}>
              <Text style={[styles.circularProgressValue, { color }]}>
                {Math.round(value)}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <Text style={[styles.circularProgressLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.circularProgressUnit, { color: colors.textSecondary }]}>{Math.round(value)} / {maxValue} {unit}</Text>
      </TouchableOpacity>
    );
  };

  const MealCard: React.FC<{
    title: string;
    targetCalories: number;
    currentCalories: number;
    color: string;
    foods: ConsumedFood[];
    onAddPress: () => void;
  }> = ({ title, targetCalories, currentCalories, color, foods, onAddPress }) => (
    <Card style={[styles.mealCard, { backgroundColor: colors.card }]}>
      <Card.Content>
        <View style={styles.mealHeader}>
          <Text style={[styles.mealTitle, { color: colors.text }]}>{title}</Text>
          <View style={styles.mealCaloriesContainer}>
            <Text style={[styles.mealCalories, { color: colors.text }]}>{currentCalories}</Text>
            <Text style={[styles.mealCaloriesTarget, { color: colors.textSecondary }]}> / {targetCalories} cal</Text>
          </View>
        </View>
        
        <ProgressBar 
          progress={Math.min(currentCalories / targetCalories, 1)} 
          color={color} 
          style={[styles.mealProgress, { backgroundColor: colors.border }]}
        />
        
        {foods.length === 0 ? (
          <TouchableOpacity style={styles.emptyMeal} onPress={onAddPress}>
            <Text style={[styles.emptyMealText, { color: colors.textSecondary }]}>
              Tap to add {title.toLowerCase()}
            </Text>
            <Chip 
              icon="plus" 
              mode="outlined" 
              onPress={onAddPress}
              style={[styles.addChip, { borderColor: color, backgroundColor: colors.surface }]}
              textStyle={{ color }}
            >
              Add Food
            </Chip>
          </TouchableOpacity>
        ) : (
          <View style={styles.foodList}>
            {foods.slice(0, 3).map((food) => (
              <Surface key={food.id} style={[styles.foodItem, { backgroundColor: colors.surface }]}>
                <View style={styles.foodItemContent}>
                  <Text style={[styles.foodItemName, { color: colors.text }]} numberOfLines={1}>
                    {food.food.description}
                  </Text>
                  <Text style={[styles.foodItemDetails, { color: colors.textSecondary }]}>
                    {food.quantity} {food.food.servingSizeUnit} • {food.calculatedNutrients?.calories || 0} cal
                  </Text>
                </View>
                <IconButton
                  icon="close"
                  size={18}
                  iconColor={colors.textSecondary}
                  onPress={() => handleRemoveFood(food.id)}
                  style={styles.removeButton}
                />
              </Surface>
            ))}
            {foods.length > 3 && (
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={[styles.viewMoreText, { color: colors.primary }]}>View {foods.length - 3} more items</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.addMoreButton} onPress={onAddPress}>
              <Text style={[styles.addMoreText, { color }]}>+ Add more food</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        translucent={true}
      />
      
      {/* Custom Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            }],
            opacity: animatedValue,
          }
        ]}
      >
        <Menu
          visible={settingsVisible}
          onDismiss={() => setSettingsVisible(false)}
          anchor={
            <IconButton 
              icon="cog" 
              size={24} 
              iconColor={colors.textSecondary} 
              onPress={() => setSettingsVisible(true)}
              style={styles.headerButton}
            />
          }
        >
          <Menu.Item onPress={() => navigation.navigate('BarcodeScanner')} title="Scan Barcode" leadingIcon="barcode-scan" />
          <Menu.Item onPress={handleEditGoals} title="Edit Goals" leadingIcon="target" />
          <Menu.Item onPress={handleExportData} title="Export Data" leadingIcon="download" />
          <Divider />
          <Menu.Item onPress={handleClearLog} title="Clear All Data" leadingIcon="delete" />
        </Menu>
        
        <TouchableOpacity style={styles.headerCenter} onPress={handleCalendar}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Today</Text>
          <Text style={[styles.headerDate, { color: colors.textSecondary }]}>{getTodayDate()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.themeToggleSimple}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Text style={styles.themeToggleIconSimple}>
            {isDarkMode ? '🌙' : '☀️'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Calories Summary */}
        <Animated.View
          style={[
            styles.caloriesCard,
            {
              transform: [{
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              }],
              opacity: animatedValue,
            }
          ]}
        >
          <Card style={[styles.caloriesCardInner, { backgroundColor: colors.card }]}>
            <Card.Content style={styles.caloriesContent}>
              <View style={styles.caloriesMain}>
                <Text style={[styles.caloriesConsumed, { color: colors.primary }]}>{totals.calories}</Text>
                <Text style={[styles.caloriesLabel, { color: colors.textSecondary }]}>calories consumed</Text>
                <ProgressBar 
                  progress={getCaloriesProgress()} 
                  color={colors.primary} 
                  style={[styles.caloriesProgress, { backgroundColor: colors.border }]}
                />
              </View>
              <View style={styles.caloriesStats}>
                <View style={styles.caloriesStat}>
                  <Text style={[styles.caloriesStatValue, { color: colors.text }]}>{goals.calories}</Text>
                  <Text style={[styles.caloriesStatLabel, { color: colors.textSecondary }]}>Goal</Text>
                </View>
                <View style={styles.caloriesStat}>
                  <Text style={[styles.caloriesStatValue, { color: colors.text }]}>{getCaloriesRemaining()}</Text>
                  <Text style={[styles.caloriesStatLabel, { color: colors.textSecondary }]}>Remaining</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Macronutrients */}
        <Card style={[styles.macroCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Macronutrients</Text>
            <View style={styles.macroGrid}>
              <CircularProgressItem
                value={totals.carbohydrates}
                maxValue={goals.carbohydrates}
                label="Carbs"
                unit="g"
                color="#F59E0B"
              />
              <CircularProgressItem
                value={totals.protein}
                maxValue={goals.protein}
                label="Protein"
                unit="g"
                color={colors.primary}
              />
              <CircularProgressItem
                value={totals.fat}
                maxValue={goals.fat}
                label="Fat"
                unit="g"
                color="#EF4444"
              />
            </View>
          </Card.Content>
        </Card>

        {/* Meals */}
        <MealCard
          title="Breakfast"
          targetCalories={500}
          currentCalories={foodLog.filter(food => 
            new Date(food.consumedAt).getHours() < 12
          ).reduce((sum, food) => sum + (food.calculatedNutrients?.calories || 0), 0)}
          color="#10B981"
          foods={foodLog.filter(food => new Date(food.consumedAt).getHours() < 12)}
          onAddPress={() => handleQuickAdd('breakfast')}
        />

        <MealCard
          title="Lunch"
          targetCalories={600}
          currentCalories={foodLog.filter(food => {
            const hour = new Date(food.consumedAt).getHours();
            return hour >= 12 && hour < 17;
          }).reduce((sum, food) => sum + (food.calculatedNutrients?.calories || 0), 0)}
          color="#0066CC"
          foods={foodLog.filter(food => {
            const hour = new Date(food.consumedAt).getHours();
            return hour >= 12 && hour < 17;
          })}
          onAddPress={() => handleQuickAdd('lunch')}
        />

        <MealCard
          title="Dinner"
          targetCalories={700}
          currentCalories={foodLog.filter(food => 
            new Date(food.consumedAt).getHours() >= 17
          ).reduce((sum, food) => sum + (food.calculatedNutrients?.calories || 0), 0)}
          color="#8B5CF6"
          foods={foodLog.filter(food => new Date(food.consumedAt).getHours() >= 17)}
          onAddPress={() => handleQuickAdd('dinner')}
        />

        <MealCard
          title="Snacks"
          targetCalories={200}
          currentCalories={foodLog.filter(food => 
            food.food.description.toLowerCase().includes('snack') ||
            food.food.description.toLowerCase().includes('chip') ||
            food.food.description.toLowerCase().includes('cookie')
          ).reduce((sum, food) => sum + (food.calculatedNutrients?.calories || 0), 0)}
          color="#F59E0B"
          foods={foodLog.filter(food => 
            food.food.description.toLowerCase().includes('snack') ||
            food.food.description.toLowerCase().includes('chip') ||
            food.food.description.toLowerCase().includes('cookie')
          )}
          onAddPress={() => handleQuickAdd('snacks')}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button - Centered */}
      <FAB
        style={[styles.fabCenter, { backgroundColor: colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('Search')}
        color="#FFFFFF"
        mode="elevated"
        size="medium"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerButton: {
    margin: 0,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerDate: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  caloriesCard: {
    marginVertical: 16,
  },
  caloriesCardInner: {
    borderRadius: 20,
    elevation: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  caloriesContent: {
    padding: 24,
  },
  caloriesMain: {
    alignItems: 'center',
    marginBottom: 24,
  },
  caloriesConsumed: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0066CC',
    marginBottom: 4,
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  caloriesProgress: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    width: width - 80,
  },
  caloriesStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  caloriesStat: {
    alignItems: 'center',
  },
  caloriesStatValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  caloriesStatLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  macroCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  circularProgressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  circularProgressLabel: {
    fontSize: 16,
    color: '#1E293B',
    marginTop: 12,
    fontWeight: '500',
  },
  circularProgressUnit: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  mealCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  mealCaloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  mealCaloriesTarget: {
    fontSize: 14,
    color: '#64748B',
  },
  mealProgress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  emptyMeal: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyMealText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  addChip: {
    backgroundColor: 'transparent',
  },
  foodList: {
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    elevation: 1,
  },
  foodItemContent: {
    flex: 1,
    marginRight: 8,
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  foodItemDetails: {
    fontSize: 14,
    color: '#64748B',
  },
  removeButton: {
    margin: 0,
  },
  viewMoreButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  addMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  addMoreText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
  },
  fabCenter: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    borderRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  themeToggleSimple: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeToggleIconSimple: {
    fontSize: 20,
    textAlign: 'center',
  }
});

export default HomeScreen; 