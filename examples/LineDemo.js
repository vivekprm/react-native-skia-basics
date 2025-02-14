import { Canvas, Line, vec } from "@shopify/react-native-skia";
const LineDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Line
        p1={vec(0, 0)}
        p2={vec(256, 256)}
        color="lightblue"
        style="stroke"
        strokeWidth={4}
      />
    </Canvas>
  );
};
export default LineDemo;
