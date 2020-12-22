const path = require("path");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    // Add all path aliases
    config.resolve.alias = {
      "@frontend/util": path.resolve(__dirname, "..", "util"),
      "@frontend/components": path.resolve(__dirname, "..", "components"),
      "@frontend/context": path.resolve(__dirname, "..", "context"),
    };

    return config;
  },
};
