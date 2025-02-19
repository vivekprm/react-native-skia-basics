import React from "react";
import {
  Canvas,
  Rect,
  FractalNoise,
  Skia,
  Shader,
  Fill,
  vec,
} from "@shopify/react-native-skia";
export const FractalNoiseDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="white" />
      <Rect x={0} y={0} width={256} height={256}>
        <FractalNoise freqX={0.05} freqY={0.05} octaves={4} />
      </Rect>
    </Canvas>
  );
};
