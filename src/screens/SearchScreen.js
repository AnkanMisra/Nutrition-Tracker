import React, { useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Card,
  List,
  Searchbar,
  Surface,
  Text
} from 'react-native-paper';
import { searchFoods } from '../services/foodApi';

const SearchScreen = (props) => {
  // Safely extract navigation from props with fallback
  const navigation = props?.navigation || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a food name to search');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const results = await searchFoods(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to search foods');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle food selection
  const handleFoodSelect = (food) => {
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('FoodDetails', { food });
      } else {
        console.error('Navigation is not available');
      }
    } catch (error) {
      console.error('Error navigating to food details:', error);
    }
  };

  // Render empty state based on search status
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Searching for foods...</Text>
        </View>
      );
    }

    if (hasSearched) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No foods found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.instructionText}>Search for foods to add</Text>
        <Text style={styles.instructionSubtext}>Enter a food name above and tap Search</Text>
      </View>
    );
  };

  // Render search result item
  const renderFoodItem = ({ item, index }) => {
    // Add a slight delay to each item for a staggered animation effect
    const animationDelay = index * 50;

    return (
      <Animated.View
        style={{
          opacity: 1,
          transform: [{ translateY: 0 }],
          animationDelay: `${animationDelay}ms`
        }}
      >
        <Surface style={styles.itemSurface}>
          <List.Item
            title={<Text style={styles.itemTitle}>{item.description}</Text>}
            description={
              <Text style={styles.itemDescription}>
                {`${item.brandOwner ? `${item.brandOwner} • ` : ''}${item.dataType}`}
              </Text>
            }
            onPress={() => handleFoodSelect(item)}
            right={() => <List.Icon icon="chevron-right" color="#6200ee" />}
            style={styles.listItem}
            left={() => (
              <View style={styles.foodTypeIndicator}>
                <Text style={styles.foodTypeText}>
                  {item.dataType === 'Branded' ? 'B' :
                    item.dataType === 'Foundation' ? 'F' :
                      item.dataType === 'SR Legacy' ? 'SR' : 'S'}
                </Text>
              </View>
            )}
          />
        </Surface>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Surface style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for foods..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          iconColor="#6200ee"
          inputStyle={styles.searchInput}
          placeholderTextColor="#9e9e9e"
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          disabled={loading || !searchQuery.trim()}
          style={styles.searchButton}
          labelStyle={styles.searchButtonLabel}
          loading={loading}
        >
          Search
        </Button>
      </Surface>

      {/* Results */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.fdcId.toString()}
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        renderEmptyState()
      )}

      {/* API Note */}
      <Card style={styles.noteCard}>
        <Card.Content>
          <Text style={styles.noteText}>
            💡 Tip: This app uses the USDA FoodData Central API. For better results, replace 'DEMO_KEY' with your free API key in src/services/foodApi.js
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 10
  },
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  searchInput: {
    fontSize: 16,
    color: '#333'
  },
  searchButton: {
    borderRadius: 8,
    elevation: 2,
    height: 48
  },
  searchButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  resultsList: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  resultsContent: {
    padding: 12
  },
  itemSurface: {
    borderRadius: 8,
    elevation: 2,
    marginVertical: 4,
    backgroundColor: '#fff'
  },
  listItem: {
    padding: 4
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  itemDescription: {
    fontSize: 14,
    color: '#666'
  },
  foodTypeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 8
  },
  foodTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  separator: {
    height: 8
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  instructionSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  noteCard: {
    margin: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    elevation: 2
  },
  noteText: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center'
  }
});

export default SearchScreen;
