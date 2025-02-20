import { Canvas, Mask, Group, Circle, Rect } from "@shopify/react-native-skia";
const AlphaMaskDemo = () => (
  <Canvas style={{ width: 256, height: 256 }}>
    <Mask
      mask={
        <Group>
          <Circle cx={128} cy={128} r={128} opacity={0.5} />
          <Circle cx={128} cy={128} r={64} />
        </Group>
      }
    >
      <Rect x={0} y={0} width={256} height={256} color="lightblue" />
    </Mask>
  </Canvas>
);
export default AlphaMaskDemo;
