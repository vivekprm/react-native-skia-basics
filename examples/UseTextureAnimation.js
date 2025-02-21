import { useWindowDimensions } from "react-native";
import { useTexture } from "@shopify/react-native-skia";
import { Image, Rect, rect, Canvas, Fill } from "@shopify/react-native-skia";
import React from "react";

const UseTextureAnimation = () => {
  const { width, height } = useWindowDimensions();
  const texture = useTexture(<Fill color="cyan" />, { width, height });
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={texture} rect={{ x: 0, y: 0, width, height }} />
    </Canvas>
  );
};
export default UseTextureAnimation;
