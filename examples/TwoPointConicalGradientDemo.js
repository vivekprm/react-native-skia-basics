import React from "react";
import {
  Canvas,
  Rect,
  TwoPointConicalGradient,
  Skia,
  Shader,
  vec,
} from "@shopify/react-native-skia";
export const TwoPointConicalGradientDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <TwoPointConicalGradient
          start={vec(128, 128)}
          startR={128}
          end={vec(128, 16)}
          endR={16}
          colors={["blue", "yellow"]}
        />
      </Rect>
    </Canvas>
  );
};
