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
import BarcodeScannerScreen from './src/screens/BarcodeScannerScreen';

// Import types and context
import { RootStackParamList } from './src/types';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

// Create dynamic themes
const createTheme = (isDarkMode: boolean): MD3Theme => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: isDarkMode ? '#3B82F6' : '#0066CC',
    onPrimary: '#ffffff',
    primaryContainer: isDarkMode ? '#1E3A8A' : '#E3F2FD',
    onPrimaryContainer: isDarkMode ? '#93C5FD' : '#0066CC',
    secondary: '#10B981',
    onSecondary: '#ffffff',
    secondaryContainer: isDarkMode ? '#064E3B' : '#ECFDF5',
    onSecondaryContainer: '#10B981',
    tertiary: '#F59E0B',
    onTertiary: '#ffffff',
    tertiaryContainer: isDarkMode ? '#92400E' : '#FEF3C7',
    onTertiaryContainer: '#F59E0B',
    error: '#EF4444',
    onError: '#ffffff',
    errorContainer: isDarkMode ? '#7F1D1D' : '#FEE2E2',
    onErrorContainer: '#EF4444',
    background: isDarkMode ? '#0F172A' : '#F8FAFC',
    onBackground: isDarkMode ? '#F8FAFC' : '#1E293B',
    surface: isDarkMode ? '#1E293B' : '#FFFFFF',
    onSurface: isDarkMode ? '#F8FAFC' : '#1E293B',
    surfaceVariant: isDarkMode ? '#334155' : '#F1F5F9',
    onSurfaceVariant: isDarkMode ? '#94A3B8' : '#64748B',
    outline: isDarkMode ? '#475569' : '#CBD5E1',
    outlineVariant: isDarkMode ? '#334155' : '#E2E8F0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: isDarkMode ? '#F8FAFC' : '#1E293B',
    inverseOnSurface: isDarkMode ? '#0F172A' : '#F8FAFC',
    inversePrimary: isDarkMode ? '#0066CC' : '#60A5FA',
    elevation: {
      level0: 'transparent',
      level1: isDarkMode ? '#1E293B' : '#FFFFFF',
      level2: isDarkMode ? '#334155' : '#F8FAFC',
      level3: isDarkMode ? '#475569' : '#F1F5F9',
      level4: isDarkMode ? '#64748B' : '#E2E8F0',
      level5: isDarkMode ? '#94A3B8' : '#CBD5E1',
    },
    surfaceDisabled: isDarkMode ? '#334155' : '#E2E8F0',
    onSurfaceDisabled: isDarkMode ? '#64748B' : '#94A3B8',
    backdrop: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.5)',
  },
  roundness: 12,
});

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const theme = createTheme(isDarkMode);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={isDarkMode ? "#0F172A" : "#F8FAFC"} />
        <View style={Platform.OS === 'web' ? styles.webContainer : styles.mobileContainer}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
            />
            <Stack.Screen
              name="FoodDetails"
              component={FoodDetailsScreen}
            />
            <Stack.Screen
              name="BarcodeScanner"
              component={BarcodeScannerScreen}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 12 : 0,
    ...(Platform.OS === 'web' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
    } : {}),
  },
  mobileContainer: {
    flex: 1,
  }
}); 