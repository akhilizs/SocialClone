// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // The story viewer drives a legacy Animated.Value for the progress bar and
    // swipe-to-dismiss gesture; both are intentionally read during render, which
    // the react-hooks compiler rules don't yet have an exception for.
    files: ["src/app/story/**/*.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
]);
