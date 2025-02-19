import { Canvas, Image, useVideo } from "@shopify/react-native-skia";
import { useAssets } from "expo-asset";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
// Example usage:
// const video = useVideoFromAsset(require("./BigBuckBunny.mp4"));
export const useVideoFromAsset = (mod, options) => {
  const [assets, error] = useAssets([mod]);
  if (error) {
    throw error;
  }
  return useVideo(assets ? assets[0].localUri : null, options);
};

export const VideoAssetExample = () => {
  const seek = useSharedValue(null);
  // Set this value to true to pause the video
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const { currentFrame, currentTime } = useVideoFromAsset(
    require("../assets/BigBuckBunny.mp4")
  );
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
