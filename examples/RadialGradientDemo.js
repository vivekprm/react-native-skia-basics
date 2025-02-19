import React from "react";
import {
  Canvas,
  Rect,
  RadialGradient,
  Skia,
  Shader,
  vec,
} from "@shopify/react-native-skia";

const RadialGradientDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <RadialGradient c={vec(128, 128)} r={128} colors={["blue", "yellow"]} />
      </Rect>
    </Canvas>
  );
};
export default RadialGradientDemo;
