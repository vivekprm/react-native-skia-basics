import React from "react";
import {
  Canvas,
  Rect,
  LinearGradient,
  Skia,
  Shader,
  vec,
} from "@shopify/react-native-skia";
const LinearGradientDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(256, 256)}
          colors={["blue", "yellow"]}
        />
      </Rect>
    </Canvas>
  );
};
export default LinearGradientDemo;
