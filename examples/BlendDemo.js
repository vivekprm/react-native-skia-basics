import React from "react";
import {
  Canvas,
  Rect,
  Turbulence,
  Skia,
  Shader,
  Fill,
  RadialGradient,
  Blend,
  vec,
} from "@shopify/react-native-skia";
export const BlendDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <Blend mode="difference">
          <RadialGradient
            r={128}
            c={vec(128, 128)}
            colors={["blue", "yellow"]}
          />
          <Turbulence freqX={0.05} freqY={0.05} octaves={4} />
        </Blend>
      </Rect>
    </Canvas>
  );
};
