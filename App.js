import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Paint,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { SafeAreaView, StyleSheet, View, ViewComponent } from "react-native";

const width = 256;
const height = 650;
const strokeWidth = 30;
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Canvas style={{ width, height }}>
        <Group color="red">
          <Circle c={vec(100, 150)} r={100} />
        </Group>
        <Group color={0xffff0000}>
          <Circle c={vec(100, 320)} r={50} />
        </Group>
        <Group color="hsl(120, 100%, 50%)">
          <Circle c={vec(100, 450)} r={50} />
        </Group>
        <Group opacity={0.5}>
          <Circle c={vec(100, 580)} r={50} color="red" />
          <Circle
            c={vec(100, 580)}
            r={50}
            color="lightblue"
            style="stroke"
            strokeWidth={strokeWidth}
          />
          <Circle
            c={vec(100, 580)}
            r={50}
            color="mint"
            style="stroke"
            strokeWidth={strokeWidth / 2}
          />
        </Group>
      </Canvas>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
export default App;
