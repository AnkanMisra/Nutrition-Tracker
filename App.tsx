import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, MD3Theme } from 'react-native-paper';

// Import screens
import FoodDetailsScreen from './src/screens/FoodDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';

// Import types
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

// Create a custom theme based on DefaultTheme
const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    onPrimary: '#ffffff',
    primaryContainer: '#bb86fc',
    onPrimaryContainer: '#000000',
    secondary: '#03dac4',
    onSecondary: '#000000',
    secondaryContainer: '#03dac4',
    onSecondaryContainer: '#000000',
    tertiary: '#03dac4',
    onTertiary: '#000000',
    tertiaryContainer: '#03dac4',
    onTertiaryContainer: '#000000',
    error: '#d32f2f',
    onError: '#ffffff',
    errorContainer: '#ffcdd2',
    onErrorContainer: '#000000',
    background: '#f5f5f5',
    onBackground: '#333333',
    surface: '#ffffff',
    onSurface: '#333333',
    surfaceVariant: '#f5f5f5',
    onSurfaceVariant: '#333333',
    outline: '#cccccc',
    outlineVariant: '#e0e0e0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#333333',
    inverseOnSurface: '#ffffff',
    inversePrimary: '#bb86fc',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(247, 243, 249)',
      level2: 'rgb(243, 237, 246)',
      level3: 'rgb(238, 232, 244)',
      level4: 'rgb(236, 230, 243)',
      level5: 'rgb(233, 226, 240)',
    },
    surfaceDisabled: '#e0e0e0',
    onSurfaceDisabled: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 8,
};

export default function App(): React.ReactElement {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#5000c9" />
        <View style={Platform.OS === 'web' ? styles.webContainer : styles.mobileContainer}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6200ee',
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 20,
              },
              cardStyle: { backgroundColor: '#f5f5f5' },
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Nutrition Tracker' }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: 'Search Food' }}
            />
            <Stack.Screen
              name="FoodDetails"
              component={FoodDetailsScreen}
              options={{ title: 'Food Details' }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    maxWidth: 800,  // Limit width on web for better readability
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 8 : 0,
    ...(Platform.OS === 'web' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    } : {}),
  },
  mobileContainer: {
    flex: 1,
  }
}); 