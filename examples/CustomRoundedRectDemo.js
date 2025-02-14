import { Canvas, RoundedRect } from "@shopify/react-native-skia";
const CustomRoundedRectDemo = () => {
  const size = 256;
  const r = size * 0.2;
  const rrct = {
    rect: { x: 0, y: 0, width: size, height: size },
    topLeft: { x: 0, y: 0 },
    topRight: { x: r, y: r },
    bottomRight: { x: 0, y: 0 },
    bottomLeft: { x: r, y: r },
  };
  return (
    <Canvas style={{ width: size, height: size }}>
      <RoundedRect rect={rrct} color="lightblue" />
    </Canvas>
  );
};
export default CustomRoundedRectDemo;
