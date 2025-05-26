const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add any custom configuration here

module.exports = withNativeWind(config, { input: './global.css' });