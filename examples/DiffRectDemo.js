import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
const DiffRectDemo = () => {
  const outer = rrect(rect(0, 0, 256, 256), 25, 25);
  const inner = rrect(rect(50, 50, 256 - 100, 256 - 100), 50, 50);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <DiffRect inner={inner} outer={outer} color="lightblue" />
    </Canvas>
  );
};

export default DiffRectDemo;
