import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { IconButton, ActivityIndicator, Surface } from 'react-native-paper';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { searchFoodByBarcode } from '../services/foodApi';

type BarcodeScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BarcodeScanner'>;
type BarcodeScannerScreenRouteProp = RouteProp<RootStackParamList, 'BarcodeScanner'>;

interface Props {
  navigation: BarcodeScannerScreenNavigationProp;
  route: BarcodeScannerScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

const BarcodeScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setLoading(true);

    try {
      // Search for food by barcode
      const foodData = await searchFoodByBarcode(data);
      
      if (foodData) {
        // Navigate to food details with the scanned product
        navigation.navigate('FoodDetails', { food: foodData });
      } else {
        // Show alert if product not found
        Alert.alert(
          'Product Not Found',
          'This barcode was not found in our database. You can try searching manually.',
          [
            { text: 'Search Manually', onPress: () => navigation.navigate('Search') },
            { text: 'Scan Again', onPress: () => setScanned(false) }
          ]
        );
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      Alert.alert(
        'Scan Error',
        'Failed to process the barcode. Please try again.',
        [
          { text: 'Try Again', onPress: () => setScanned(false) },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.permissionText, { color: colors.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.text}
            onPress={() => navigation.goBack()}
          />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Camera Permission</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionTitle, { color: colors.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            Please enable camera access in your device settings to scan food barcodes.
          </Text>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // On iOS, this will prompt to open settings
              Alert.alert(
                'Camera Permission',
                'Please go to Settings > Privacy > Camera and enable access for this app.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} />
      
      {/* Header Overlay */}
      <View style={styles.headerOverlay}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="#FFFFFF"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitleOverlay}>Scan Barcode</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Camera View */}
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e'],
        }}
      />

      {/* Scanning Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
        </View>
        
        <Surface style={styles.instructionCard}>
          <Text style={styles.instructionText}>
            {loading ? 'Processing barcode...' : 'Position the barcode within the frame'}
          </Text>
          {loading && <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />}
        </Surface>

        {scanned && !loading && (
          <TouchableOpacity
            style={[styles.scanAgainButton, { backgroundColor: colors.primary }]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerTitleOverlay: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  settingsButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: width * 0.8,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  instructionCard: {
    position: 'absolute',
    bottom: 120,
    marginHorizontal: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
  loader: {
    marginTop: 12,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BarcodeScannerScreen; 