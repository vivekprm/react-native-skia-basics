import {
  Canvas,
  Group,
  Image,
  rect,
  rrect,
  useImage,
} from "@shopify/react-native-skia";
import React from "react";

const size = 256;
const padding = 32;
const r = 8;

const ClipRoundedRectangle = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  const roundedRect = rrect(
    rect(padding, padding, size - padding * 2, size - padding * 2),
    r,
    r
  );

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group clip={roundedRect}>
        <Image
          image={image}
          x={0}
          y={0}
          width={size}
          height={size}
          fit="cover"
        />
      </Group>
    </Canvas>
  );
};
export default ClipRoundedRectangle;
