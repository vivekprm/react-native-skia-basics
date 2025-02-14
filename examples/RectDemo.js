import { Canvas, Rect } from "@shopify/react-native-skia";
const RectDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Rect x={0} y={0} width={256} height={256} color="lightblue" />
    </Canvas>
  );
};
export default RectDemo;
