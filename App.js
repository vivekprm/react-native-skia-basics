import React from "react";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
const App = () => {
  const width = 256;
  const height = 256;
  const r = useSharedValue(width * 0.33);
  const color = useSharedValue("cyan");

  const tap = Gesture.Tap()
    .onBegin(() => {
      r.value = r.value + 10;
      color.value = "blue";
    })
    .onFinalize(() => {
      r.value = width * 0.33;
      color.value = "cyan";
    });
  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={tap}>
        <Canvas style={{ width, height }}>
          <Circle cx={r} cy={r} r={r} color={color} />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
