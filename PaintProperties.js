import { Canvas, Circle, Group } from "@shopify/react-native-skia";

const width = 256;
const height = 256;
const PaintProperties = () => {
  const r = 128;
  return (
    <Canvas style={{ width, height }}>
      <Circle cx={r} cy={r} r={r} color="#51AFED" />
      {/* The paint is inherited by the following sibling and descendants. */}
      <Group color="lightblue" style="stroke" strokeWidth={10}>
        <Circle cx={r} cy={r} r={r / 2} />
        <Circle cx={r} cy={r} r={r / 3} color="white" />
      </Group>
    </Canvas>
  );
};

export default PaintProperties;
