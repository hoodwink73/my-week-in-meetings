import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { ThemeProvider } from "emotion-theming";

import theme from "../src/theme";
import GlobalStyles from "../src/components/GlobalStyles";

const ThemeDecorator = storyFn => (
  <ThemeProvider theme={theme}>
    {
      <>
        <GlobalStyles />
        {storyFn()}
      </>
    }
  </ThemeProvider>
);

addDecorator(ThemeDecorator);

function loadStories() {
  require("../src/stories");
}

configure(loadStories, module);
