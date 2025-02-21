import { Canvas, useClock, vec, Circle } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

export default function UseClockAnimation() {
  const t = useClock();

  const transform = useDerivedValue(() => {
    const scale = (2 / (3 - Math.cos(2 * t.value))) * 200;
    return [
      { translateX: scale * Math.cos(t.value) },
      { translateY: scale * (Math.sin(2 * t.value) / 2) },
    ];
  });

  return (
    <Canvas style={{ width: 450, height: 450 }}>
      <Circle c={vec(100, 300)} r={50} color="cyan" transform={transform} />
    </Canvas>
  );
}
