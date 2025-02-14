import { Canvas, RoundedRect } from "@shopify/react-native-skia";
const RoundedRectDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <RoundedRect
        x={0}
        y={0}
        width={256}
        height={256}
        r={25}
        color="lightblue"
      />
    </Canvas>
  );
};
export default RoundedRectDemo;
