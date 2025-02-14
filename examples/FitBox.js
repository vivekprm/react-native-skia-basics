import { Canvas, FitBox, Path, rect } from "@shopify/react-native-skia";
import React from "react";

export const SVGFitBox = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <FitBox src={rect(0, 0, 664, 308)} dst={rect(0, 0, 256, 256)}>
        <Path
          path="M150 5 L75 200 L225 200 Z"
          strokeCap="round"
          strokeJoin="round"
          style="stroke"
          strokeWidth={30}
        />
      </FitBox>
    </Canvas>
  );
};

export default SVGFitBox;
