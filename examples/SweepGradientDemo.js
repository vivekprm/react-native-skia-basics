import React from "react";
import {
  Canvas,
  Rect,
  SweepGradient,
  Skia,
  Shader,
  vec,
} from "@shopify/react-native-skia";
export const SweepGradientDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <SweepGradient
          c={vec(128, 128)}
          colors={["cyan", "magenta", "yellow", "cyan"]}
        />
      </Rect>
    </Canvas>
  );
};
