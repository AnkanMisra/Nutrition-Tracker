const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfills for Hermes
config.resolver.alias = {
  ...config.resolver.alias,
};

// Ensure proper asset resolution
config.resolver.assetExts.push('svg');

// Add transformer for better compatibility
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// Filter out svg from asset extensions since we're using svg-transformer
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config; 