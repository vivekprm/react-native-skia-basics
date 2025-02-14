import { Canvas, Skia, Fill, Path } from "@shopify/react-native-skia";
const star = () => {
  const R = 115.2;
  const C = 128.0;
  const path = Skia.Path.Make();
  path.moveTo(C + R, C);
  for (let i = 1; i < 8; ++i) {
    const a = 2.6927937 * i;
    path.lineTo(C + R * Math.cos(a), C + R * Math.sin(a));
  }
  return path;
};
const FillTypeDemo = () => {
  const path = star();
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="white" />
      <Path path={path} style="stroke" strokeWidth={4} color="#3EB489" />
      <Path path={path} color="lightblue" fillType="evenOdd" />
    </Canvas>
  );
};
export default FillTypeDemo;
