import { useWindowDimensions } from "react-native";
import { useImageAsTexture } from "@shopify/react-native-skia";
import { Image, Rect, rect, Canvas, Fill } from "@shopify/react-native-skia";
import React from "react";

const ImageTextureAnimation = () => {
  const { width, height } = useWindowDimensions();
  const texture = useImageAsTexture(require("../assets/oslo.jpg"));
  return (
    <Canvas style={{ width, height }}>
      <Image image={texture} rect={{ x: 0, y: 0, width, height }} />
    </Canvas>
  );
};
export default ImageTextureAnimation;
