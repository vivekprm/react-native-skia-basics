import { Canvas, CornerPathEffect, Rect } from "@shopify/react-native-skia";
const CornerPathEffectDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={64} y={16} width={128} height={256 - 16} color="#61DAFB">
        <CornerPathEffect r={64} />
      </Rect>
    </Canvas>
  );
};
export default CornerPathEffectDemo;
