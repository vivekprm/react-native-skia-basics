import {
  BlendColor,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  Image,
  useImage,
} from "@shopify/react-native-skia";
const MatrixColorBlendFilter = () => {
  const r = 128;
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group>
        <BlendColor color="cyan" mode="multiply" />
        <Circle cx={r} cy={r} r={r} color="yellow" />
        <Circle cx={2 * r} cy={r} r={r} color="magenta" />
      </Group>
    </Canvas>
  );
};
export default MatrixColorBlendFilter;
