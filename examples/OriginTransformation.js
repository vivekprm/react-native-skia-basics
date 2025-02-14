import { Canvas, Fill, Group, RoundedRect } from "@shopify/react-native-skia";
import React from "react";

const width = 256;
const height = 256;
const OriginTransformation = () => {
  return (
    <Canvas style={{ width, height }}>
      <Fill color="#e8f4f8" />
      <Group
        color="lightblue"
        origin={{ x: 128, y: 128 }}
        transform={[{ skewX: Math.PI / 6 }]}
      >
        <RoundedRect x={64} y={64} width={128} height={128} r={10} />
      </Group>
    </Canvas>
  );
};
export default OriginTransformation;
