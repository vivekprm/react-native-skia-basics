import { useSharedValue } from "react-native-reanimated";
import { Fill, Canvas } from "@shopify/react-native-skia";

const CanvasSizeDemo = () => {
  // size will be updated as the canvas size changes
  const size = useSharedValue({ width: 0, height: 0 });
  return (
    <Canvas style={{ flex: 1 }} onSize={size}>
      <Fill color="white" />
    </Canvas>
  );
};
export default CanvasSizeDemo;
