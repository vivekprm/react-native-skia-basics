import React from "react";
import {
  Canvas,
  Image,
  useAnimatedImageValue,
} from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { Pressable } from "react-native";
const AnimatedImagesDemo = () => {
  const isPaused = useSharedValue(false);
  // This can be an animated GIF or WebP file
  const bird = useAnimatedImageValue(
    require("../assets/bird-flying.gif"),
    isPaused
  );
  return (
    <Pressable onPress={() => (isPaused.value = !isPaused.value)}>
      <Canvas
        style={{
          width: 320,
          height: 180,
        }}
      >
        <Image
          image={bird}
          x={0}
          y={0}
          width={320}
          height={180}
          fit="contain"
        />
      </Canvas>
    </Pressable>
  );
};

export default AnimatedImagesDemo;
