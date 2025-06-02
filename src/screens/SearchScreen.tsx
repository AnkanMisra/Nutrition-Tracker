import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useRef } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import {
  Button,
  Card,
  Searchbar,
  Surface,
  Text,
  IconButton,
  ActivityIndicator,
  Chip
} from 'react-native-paper';
import { searchFoods } from '../services/foodApi';
import { FoodSearchResult, RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [recentSearches] = useState<string[]>([
    'Apple', 'Chicken breast', 'Rice', 'Banana', 'Salmon', 'Broccoli', 
    'Eggs', 'Oatmeal', 'Greek yogurt', 'Almonds', 'Sweet potato', 'Spinach'
  ]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const searchBarRef = useRef<any>(null);
  const { isDarkMode, colors } = useTheme();

  // Handle search
  const handleSearch = async (query?: string): Promise<void> => {
    const searchTerm = query || searchQuery.trim();
    
    if (!searchTerm) {
      Alert.alert('Search Required', 'Please enter a food name to search');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setHasSearched(true);

    // Animate search
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    try {
      const results = await searchFoods(searchTerm);
      setSearchResults(results);
    } catch (error: any) {
      Alert.alert('Search Error', error.message || 'Failed to search foods. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle food selection
  const handleFoodSelect = (food: FoodSearchResult): void => {
    try {
      navigation.navigate('FoodDetails', { food });
    } catch (error) {
      console.error('Error navigating to food details:', error);
      Alert.alert('Navigation Error', 'Unable to view food details. Please try again.');
    }
  };

  // Handle recent search selection
  const handleRecentSearch = (query: string): void => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Clear search
  const handleClearSearch = (): void => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    animatedValue.setValue(0);
  };

  // Render empty state based on search status
  const renderEmptyState = (): React.ReactElement => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Searching foods...</Text>
          <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>This may take a few seconds</Text>
        </View>
      );
    }

    if (hasSearched) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No foods found</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Try a different search term or check your spelling</Text>
          <Button
            mode="outlined"
            onPress={handleClearSearch}
            style={[styles.tryAgainButton, { borderColor: colors.primary }]}
            labelStyle={[styles.tryAgainButtonLabel, { color: colors.primary }]}
          >
            Try Again
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.instructionContainer}>
        <Text style={[styles.instructionTitle, { color: colors.text }]}>Find Your Food</Text>
        <Text style={[styles.instructionText, { color: colors.textSecondary }]}>Search our database of over 300,000 foods</Text>
        
        {recentSearches.length > 0 && (
          <View style={styles.recentSearches}>
            <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Searches</Text>
            <View style={styles.recentChips}>
              {recentSearches.map((search, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onPress={() => handleRecentSearch(search)}
                  style={[styles.recentChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  textStyle={[styles.recentChipText, { color: colors.textSecondary }]}
                >
                  {search}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  // Get food type color
  const getFoodTypeColor = (dataType: string): string => {
    switch (dataType) {
      case 'Branded': return '#10B981';
      case 'Foundation': return '#0066CC';
      case 'SR Legacy': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  // Get food type label
  const getFoodTypeLabel = (dataType: string): string => {
    switch (dataType) {
      case 'Branded': return 'Brand';
      case 'Foundation': return 'Basic';
      case 'SR Legacy': return 'Legacy';
      default: return 'Other';
    }
  };

  // Render search result item
  const renderFoodItem: ListRenderItem<FoodSearchResult> = ({ item, index }) => {
    const animationDelay = (index || 0) * 50;
    const typeColor = getFoodTypeColor(item.dataType);
    const typeLabel = getFoodTypeLabel(item.dataType);

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          }
        ]}
      >
        <TouchableOpacity
          style={[styles.foodItem, { backgroundColor: colors.card }]}
          onPress={() => handleFoodSelect(item)}
          activeOpacity={0.7}
        >
          <View style={styles.foodItemContent}>
            <View style={styles.foodItemMain}>
              <Text style={[styles.foodItemTitle, { color: colors.text }]} numberOfLines={2}>
                {item.description}
              </Text>
              {item.brandOwner && (
                <Text style={[styles.foodItemBrand, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.brandOwner}
                </Text>
              )}
            </View>
            <Chip
              mode="flat"
              style={[styles.typeChip, { backgroundColor: `${typeColor}15` }]}
              textStyle={[styles.typeChipText, { color: typeColor }]}
            >
              {typeLabel}
            </Chip>
          </View>
          <IconButton
            icon="chevron-right"
            size={20}
            iconColor={colors.textSecondary}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        translucent={true}
      />
      
      {/* Header */}
      <View style={[
        styles.header, 
        { 
          backgroundColor: colors.background, 
          borderBottomColor: colors.border,
          paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 30,
        }
      ]}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search Foods</Text>
        <IconButton
          icon="barcode-scan"
          size={24}
          iconColor={colors.text}
          onPress={() => navigation.navigate('BarcodeScanner')}
        />
      </View>

      {/* Search Bar */}
      <Surface style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Searchbar
          ref={searchBarRef}
          placeholder="Search for foods, brands, or barcodes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={() => handleSearch()}
          style={[styles.searchBar, { backgroundColor: colors.surface }]}
          iconColor={colors.primary}
          inputStyle={[styles.searchInput, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          elevation={0}
          right={() => searchQuery ? (
            <IconButton
              icon="close"
              size={20}
              iconColor={colors.textSecondary}
              onPress={handleClearSearch}
            />
          ) : undefined}
        />
        <Button
          mode="contained"
          onPress={() => handleSearch()}
          disabled={loading || !searchQuery.trim()}
          style={styles.searchButton}
          labelStyle={styles.searchButtonLabel}
          loading={loading}
          buttonColor={colors.primary}
        >
          Search
        </Button>
      </Surface>

      {/* Results */}
      {searchResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsHeader, { color: colors.textSecondary }]}>
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </Text>
          <FlatList
            data={searchResults}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.fdcId.toString()}
            style={styles.resultsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      ) : (
        renderEmptyState()
      )}
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
  barcodeButton: {
    margin: 0,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    marginBottom: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    elevation: 0,
  },
  searchInput: {
    fontSize: 16,
    color: '#1E293B',
  },
  searchButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  searchButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  itemContainer: {
    marginBottom: 8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  foodItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  foodItemMain: {
    flex: 1,
    marginRight: 12,
  },
  foodItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 2,
  },
  foodItemBrand: {
    fontSize: 14,
    color: '#64748B',
  },
  typeChip: {
    height: 24,
    borderRadius: 12,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chevronIcon: {
    margin: 0,
  },
  separator: {
    height: 8,
  },
  centerContainer: {
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
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  tryAgainButton: {
    borderColor: '#0066CC',
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  tryAgainButtonLabel: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '500',
  },
  instructionContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  instructionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  recentSearches: {
    marginTop: 24,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  recentChip: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  recentChipText: {
    color: '#475569',
    fontSize: 14,
  },
});

export default SearchScreen; 