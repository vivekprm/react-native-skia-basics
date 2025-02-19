import React from "react";
import {
  Canvas,
  ColorMatrix,
  Fill,
  ImageShader,
  useVideo,
} from "@shopify/react-native-skia";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
export const VideoExample = () => {
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const { currentFrame } = useVideo("https://bit.ly/skia-video", {
    paused,
  });
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => (paused.value = !paused.value)}
    >
      <Canvas style={{ width, height }}>
        <Fill>
          <ImageShader
            image={currentFrame}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="cover"
          />
          <ColorMatrix
            matrix={[
              0.95, 0, 0, 0, 0.05, 0.65, 0, 0, 0, 0.15, 0.15, 0, 0, 0, 0.5, 0,
              0, 0, 1, 0,
            ]}
          />
        </Fill>
      </Canvas>
    </Pressable>
  );
};
