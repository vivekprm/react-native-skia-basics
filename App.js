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
const height = 256;

const App = () => {
  const strokeWidth = 50;
  const c = vec(width / 2, height / 2);
  const r = (width - strokeWidth) / 2;
  const r1 = width / 6;
  const r2 = width / 4;
  const r3 = width / 4;
  const paint = Skia.Paint();
  paint.setColor(Skia.Color("lightblue"));
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Canvas style={{ width, height }}>
          <Circle c={c} r={r} color="red">
            <Paint color="green" />
            <Paint color="#9f9009" style="stroke" strokeWidth={strokeWidth} />
            <Paint
              color="#abe6d8"
              style="stroke"
              strokeWidth={strokeWidth / 2}
            />
          </Circle>
        </Canvas>
      </View>
      <View>
        <Canvas style={{ width, height }}>
          <Group color="lightblue">
            <Circle cx={r1} cy={r1} r={r1} />
            <Group style="stroke" strokeWidth={10}>
              <Circle cx={3 * r1} cy={2 * r1} r={r1} />
            </Group>
          </Group>
        </Canvas>
      </View>
      <View>
        <Canvas style={{ width, height }}>
          <Circle cx={r2} cy={r2} r={r2}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(2 * r2, 2 * r2)}
              colors={["#00ff87", "#60efff"]}
            />
          </Circle>
          <Group>
            <LinearGradient
              start={vec(2 * r2, 2 * r2)}
              end={vec(4 * r2, 4 * r2)}
              colors={["#0061ff", "#60efff"]}
            />
            <Circle cx={3 * r2} cy={2 * r2} r={r2} />
          </Group>
        </Canvas>
      </View>
      <View>
        <Canvas style={{ width, height }}>
          <Circle paint={paint} cx={r3} cy={r3} r={r3} />
        </Canvas>
      </View>
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
