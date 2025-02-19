import React from "react";
import {
  Canvas,
  Rect,
  Turbulence,
  Skia,
  Shader,
  Fill,
  vec,
} from "@shopify/react-native-skia";
export const TurbulenceDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="white" />
      <Rect x={0} y={0} width={256} height={256}>
        <Turbulence freqX={0.05} freqY={0.05} octaves={4} />
      </Rect>
    </Canvas>
  );
};
