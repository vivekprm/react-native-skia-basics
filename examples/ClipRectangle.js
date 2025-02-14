import {
  Canvas,
  Fill,
  Group,
  Image,
  rect,
  useImage,
} from "@shopify/react-native-skia";
import React from "react";

const width = 256;
const height = 256;
const size = 256;
const padding = 32;

const ClipRectangle = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  const rct = rect(padding, padding, size - padding * 2, size - padding * 2);
  return (
    <Canvas style={{ width, height }}>
      <Fill color="lightblue" />
      <Group clip={rct}>
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
export default ClipRectangle;
