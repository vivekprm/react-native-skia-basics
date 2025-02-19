import React from "react";
import { Canvas, Fill, Image, useVideo } from "@shopify/react-native-skia";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
export const VideoAdvancedExample = () => {
  const seek = useSharedValue(null);
  // Set this value to true to pause the video
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const { currentFrame, currentTime } = useVideo("https://bit.ly/skia-video", {
    seek,
    paused,
    looping: true,
  });
  return (
    <Pressable style={{ flex: 1 }} onPress={() => (seek.value = 2000)}>
      <Canvas style={{ width, height }}>
        <Image
          image={currentFrame}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
      </Canvas>
    </Pressable>
  );
};
