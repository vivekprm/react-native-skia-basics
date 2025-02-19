import {
  Canvas,
  BlendColor,
  Group,
  Circle,
  LinearToSRGBGamma,
} from "@shopify/react-native-skia";
const MatrixLinearToSRGBGammaFilter = () => {
  const r = 128;
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group>
        <LinearToSRGBGamma>
          <BlendColor color="lightblue" mode="srcIn" />
        </LinearToSRGBGamma>
        <Circle cx={r} cy={r} r={r} />
      </Group>
    </Canvas>
  );
};
export default MatrixLinearToSRGBGammaFilter;
