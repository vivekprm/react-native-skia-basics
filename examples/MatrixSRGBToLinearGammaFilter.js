import {
  Canvas,
  BlendColor,
  Group,
  Circle,
  SRGBToLinearGamma,
} from "@shopify/react-native-skia";
const MatrixSRGBToLinearGammaFilter = () => {
  const r = 128;
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group>
        <SRGBToLinearGamma>
          <BlendColor color="lightblue" mode="srcIn" />
        </SRGBToLinearGamma>
        <Circle cx={r} cy={r} r={r} />
      </Group>
    </Canvas>
  );
};
export default MatrixSRGBToLinearGammaFilter;
