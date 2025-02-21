import { useWindowDimensions } from "react-native";
import { Canvas, Circle, Fill } from "@shopify/react-native-skia";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useSharedValue, withDecay } from "react-native-reanimated";
export const AnimationWithTouchHandler = () => {
  const { width } = useWindowDimensions();
  const leftBoundary = 0;
  const rightBoundary = width;
  const translateX = useSharedValue(width / 2);
  const gesture = Gesture.Pan()
    .onChange((e) => {
      translateX.value += e.changeX;
    })
    .onEnd((e) => {
      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [leftBoundary, rightBoundary],
      });
    });
  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width: 250, height: 350 }}>
          <Fill color="white" />
          <Circle cx={translateX} cy={100} r={20} color="#3E3E" />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
