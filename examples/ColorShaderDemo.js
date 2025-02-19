import React from "react";
import { Canvas, Skia, Fill, ColorShader } from "@shopify/react-native-skia";
export const ColorShaderDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill>
        <ColorShader color="lightBlue" />
      </Fill>
    </Canvas>
  );
};
