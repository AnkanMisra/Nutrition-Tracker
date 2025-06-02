import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Animated
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Text,
  TextInput,
  IconButton,
  Surface,
  Chip
} from 'react-native-paper';
import { calculateNutrition, getFoodDetails, getOpenFoodFactsDetails } from '../services/foodApi';
import { addFoodToLog } from '../utils/storage';
import { FoodItem, FoodSearchResult, Nutrients, RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';

type FoodDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FoodDetails'>;
type FoodDetailsScreenRouteProp = RouteProp<RootStackParamList, 'FoodDetails'>;

interface Props {
  navigation: FoodDetailsScreenNavigationProp;
  route: FoodDetailsScreenRouteProp;
}

const FoodDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { food } = route.params;
  const { isDarkMode, colors } = useTheme();
  const [foodDetails, setFoodDetails] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<string>('100');
  const [calculatedNutrients, setCalculatedNutrients] = useState<Nutrients | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [animatedValue] = useState(new Animated.Value(0));

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
      let details: FoodItem | null = null;
      
      // Check if this is an Open Food Facts product (dataType will be 'Open Food Facts')
      if (food.dataType === 'Open Food Facts') {
        details = await getOpenFoodFactsDetails(food.fdcId.toString());
      } else {
        // Use USDA API for other products
        details = await getFoodDetails(food.fdcId);
      }
      
      if (!details) {
        throw new Error('Could not load food details');
      }
      
      setFoodDetails(details);
      
      // Animate content in
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } catch (error: any) {
      Alert.alert('Error Loading Food', error.message || 'Failed to load food details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Add food to daily log
  const handleAddToLog = async (): Promise<void> => {
    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0');
      return;
    }

    if (!foodDetails || !calculatedNutrients) {
      Alert.alert('Error', 'Food details not loaded properly');
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
        'Food Added! 🎉',
        `${foodDetails.description} has been added to your daily log.`,
        [
          {
            text: 'Add Another Food',
            onPress: () => navigation.goBack()
          },
          {
            text: 'View My Log',
            onPress: () => navigation.navigate('Home'),
            style: 'default'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add food to your log. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  // Get food type info
  const getFoodTypeInfo = () => {
    switch (food.dataType) {
      case 'Branded':
        return { label: 'Brand', color: '#10B981', icon: 'store' };
      case 'Foundation':
        return { label: 'Basic', color: '#0066CC', icon: 'food-apple' };
      case 'SR Legacy':
        return { label: 'Legacy', color: '#F59E0B', icon: 'database' };
      case 'Open Food Facts':
        return { label: 'Scanned', color: '#8B5CF6', icon: 'barcode-scan' };
      default:
        return { label: 'Other', color: '#8B5CF6', icon: 'food' };
    }
  };

  const NutritionRow: React.FC<{
    label: string;
    value: number;
    unit: string;
    color: string;
    isMain?: boolean;
  }> = ({ label, value, unit, color, isMain = false }) => (
    <View style={[
      styles.nutritionRow, 
      isMain && [styles.mainNutritionRow, { backgroundColor: colors.surface }]
    ]}>
      <Text style={[
        styles.nutritionLabel, 
        isMain && styles.mainNutritionLabel,
        { color: colors.text }
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.nutritionValue,
        isMain && styles.mainNutritionValue,
        { color }
      ]}>
        {value.toFixed(isMain ? 0 : 1)}{unit}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} translucent={true} />
        
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.background, 
          borderBottomColor: colors.border,
          paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
        }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.text}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Food Details</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading nutrition information...</Text>
          <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>Please wait while we fetch the details</Text>
        </View>
      </View>
    );
  }

  if (!foodDetails) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} translucent={true} />
        
        {/* Header */}
        <View style={[styles.header, { 
          backgroundColor: colors.background, 
          borderBottomColor: colors.border,
          paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
        }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.text}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Food Details</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Unable to load food details</Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>Please check your connection and try again</Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
            buttonColor={colors.primary}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const typeInfo = getFoodTypeInfo();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} translucent={true} />
      
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.background, 
        borderBottomColor: colors.border,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
      }]}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.text}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Food Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Food Information */}
        <Animated.View
          style={[
            styles.foodInfoCard,
            {
              opacity: animatedValue,
              transform: [{
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            }
          ]}
        >
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content style={styles.foodInfoContent}>
              <View style={styles.foodHeader}>
                <View style={styles.foodTitleContainer}>
                  <Text style={[styles.foodTitle, { color: colors.text }]} numberOfLines={3}>
                    {foodDetails.description}
                  </Text>
                  {foodDetails.brandOwner && (
                    <Text style={[styles.brandName, { color: colors.textSecondary }]}>{foodDetails.brandOwner}</Text>
                  )}
                </View>
                <Chip
                  mode="flat"
                  icon={typeInfo.icon}
                  style={[styles.typeChip, { backgroundColor: `${typeInfo.color}15` }]}
                  textStyle={[styles.typeChipText, { color: typeInfo.color }]}
                >
                  {typeInfo.label}
                </Chip>
              </View>
              <Surface style={[styles.servingInfo, { backgroundColor: colors.surface }]}>
                <Text style={[styles.servingText, { color: colors.textSecondary }]}>
                  Nutrition per {foodDetails.servingSize} {foodDetails.servingSizeUnit}
                </Text>
              </Surface>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Quantity Input */}
        <Animated.View
          style={[
            styles.quantityCard,
            {
              opacity: animatedValue,
              transform: [{
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            }
          ]}
        >
          <Card style={[styles.card, { backgroundColor: colors.card }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Serving Size</Text>
              <View style={styles.quantityContainer}>
                <TextInput
                  label={`Amount (${foodDetails.servingSizeUnit})`}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[styles.quantityInput, { backgroundColor: colors.surface }]}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text}
                  contentStyle={[styles.quantityInputContent, { color: colors.text }]}
                />
                <View style={styles.quickAmounts}>
                  {['50', '100', '150', '200'].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.quickAmountButton,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        quantity === amount && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => setQuantity(amount)}
                    >
                      <Text style={[
                        styles.quickAmountText,
                        { color: colors.textSecondary },
                        quantity === amount && { color: '#FFFFFF' }
                      ]}>
                        {amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Calculated Nutrition */}
        {calculatedNutrients && (
          <Animated.View
            style={[
              styles.nutritionCard,
              {
                opacity: animatedValue,
                transform: [{
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              }
            ]}
          >
            <Card style={[styles.card, { backgroundColor: colors.card }]}>
              <Card.Content>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition Facts</Text>
                <Text style={[styles.nutritionSubtitle, { color: colors.textSecondary }]}>
                  Per {quantity} {foodDetails.servingSizeUnit}
                </Text>

                <View style={styles.nutritionContainer}>
                  {/* Main Calories */}
                  <NutritionRow
                    label="Calories"
                    value={calculatedNutrients.calories}
                    unit=""
                    color="#0066CC"
                    isMain={true}
                  />
                  
                  <Divider style={[styles.mainDivider, { backgroundColor: colors.border }]} />

                  {/* Macronutrients */}
                  <View style={styles.macroSection}>
                    <NutritionRow
                      label="Protein"
                      value={calculatedNutrients.protein}
                      unit="g"
                      color="#10B981"
                    />
                    <NutritionRow
                      label="Carbohydrates"
                      value={calculatedNutrients.carbohydrates}
                      unit="g"
                      color="#F59E0B"
                    />
                    <NutritionRow
                      label="Fat"
                      value={calculatedNutrients.fat}
                      unit="g"
                      color="#EF4444"
                    />
                  </View>

                  {/* Additional nutrients */}
                  {(calculatedNutrients.fiber > 0 || calculatedNutrients.sugar > 0 || calculatedNutrients.sodium > 0) && (
                    <>
                      <Divider style={[styles.divider, { backgroundColor: colors.border }]} />
                      <View style={styles.additionalSection}>
                        {calculatedNutrients.fiber > 0 && (
                          <NutritionRow
                            label="Fiber"
                            value={calculatedNutrients.fiber}
                            unit="g"
                            color="#8B5CF6"
                          />
                        )}
                        {calculatedNutrients.sugar > 0 && (
                          <NutritionRow
                            label="Sugar"
                            value={calculatedNutrients.sugar}
                            unit="g"
                            color="#EC4899"
                          />
                        )}
                        {calculatedNutrients.sodium > 0 && (
                          <NutritionRow
                            label="Sodium"
                            value={calculatedNutrients.sodium}
                            unit="mg"
                            color="#F97316"
                          />
                        )}
                      </View>
                    </>
                  )}
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Button */}
      <Surface style={[
        styles.addButtonContainer, 
        { 
          backgroundColor: colors.background,
          borderTopColor: colors.border
        }
      ]}>
        <Button
          mode="contained"
          onPress={handleAddToLog}
          disabled={adding || !quantity || parseFloat(quantity) <= 0}
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
          loading={adding}
          buttonColor={colors.primary}
          icon="plus"
        >
          {adding ? 'Adding...' : 'Add to Log'}
        </Button>
      </Surface>
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
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1E293B',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  foodInfoCard: {
    marginTop: 16,
  },
  card: {
    borderRadius: 20,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 16,
  },
  foodInfoContent: {
    padding: 20,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  foodTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  foodTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 32,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  servingInfo: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    elevation: 0,
  },
  servingText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    textAlign: 'center',
  },
  quantityCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  quantityContainer: {
    gap: 16,
  },
  quantityInput: {
    // backgroundColor will be set dynamically based on theme
  },
  quantityInputContent: {
    fontSize: 18,
    fontWeight: '500',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickAmountButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  quickAmountTextActive: {
    color: '#FFFFFF',
  },
  nutritionCard: {
    marginBottom: 16,
  },
  nutritionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  nutritionContainer: {
    gap: 4,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  mainNutritionRow: {
    paddingVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    // backgroundColor will be set dynamically based on theme
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  mainNutritionLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  mainNutritionValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  mainDivider: {
    height: 2,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  macroSection: {
    gap: 4,
  },
  additionalSection: {
    gap: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  addButtonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
  },
  addButton: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  addButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  }
});

export default FoodDetailsScreen; 