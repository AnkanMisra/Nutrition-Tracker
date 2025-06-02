// Polyfills for Hermes compatibility
import 'react-native-url-polyfill/auto';

// URL polyfill for Hermes
if (typeof URL === 'undefined') {
  global.URL = require('react-native-url-polyfill').URL;
}

// Additional polyfills for better compatibility
if (typeof URLSearchParams === 'undefined') {
  global.URLSearchParams = require('react-native-url-polyfill').URLSearchParams;
} 