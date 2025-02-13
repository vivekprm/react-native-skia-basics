import React from "react";
import { Canvas, Fill } from "@shopify/react-native-skia";
import { useContextBridge, FiberProvider } from "its-fine";
import { ThemeProvider, useTheme } from "./ThemeProvider";
const MyDrawing = () => {
  const { primary } = useTheme();
  return <Fill color={primary} />;
};
export const Layer = () => {
  const ContextBridge = useContextBridge();
  return (
    <Canvas style={{ flex: 1 }}>
      <ContextBridge>
        <Fill color="black" />
        <MyDrawing />
      </ContextBridge>
    </Canvas>
  );
};
const App = () => {
  return (
    <FiberProvider>
      <ThemeProvider primary="blue">
        <Layer />
      </ThemeProvider>
    </FiberProvider>
  );
};

export default App;
