module.exports = function({ config }) {
  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [
      {
        loader: require.resolve("@storybook/addon-storysource/loader"),
        options: {
          prettierConfig: {
            printWidth: 80,
            tabWidth: 2,
            bracketSpacing: true,
            trailingComma: "es5",
            singleQuote: true
          }
        }
      }
    ],

    enforce: "pre"
  });

  return config;
};
