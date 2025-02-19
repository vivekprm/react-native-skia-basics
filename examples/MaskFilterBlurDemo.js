import {
  Canvas,
  Fill,
  Circle,
  BlurMask,
  vec,
} from "@shopify/react-native-skia";
const MaskFilterBlurDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Circle c={vec(128)} r={128} color="lightblue">
        <BlurMask blur={20} style="normal" />
      </Circle>
    </Canvas>
  );
};
export default MaskFilterBlurDemo;
