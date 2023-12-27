// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const {
  createSentryMetroSerializer,
} = require("@sentry/react-native/dist/js/tools/sentryMetroSerializer");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("lottie");
config.serializer = { customSerializer: createSentryMetroSerializer() };
module.exports = config;
