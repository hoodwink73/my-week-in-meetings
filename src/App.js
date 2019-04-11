import React, { Component } from "react";
import { ThemeProvider } from "emotion-theming";
import { Box } from "@rebass/emotion";

import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Box color="white" bg="blue">
          Hello
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
