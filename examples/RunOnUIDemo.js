import { useEffect } from "react";
import { runOnUI, useSharedValue } from "react-native-reanimated";
import { Skia, Canvas, Image } from "@shopify/react-native-skia";

const createTexture = (image) => {
  "worklet";
  const surface = Skia.Surface.MakeOffscreen(200, 200);
  const canvas = surface.getCanvas();
  canvas.drawColor(Skia.Color("cyan"));
  surface.flush();
  image.value = surface.makeImageSnapshot();
};

const RunOnUIDemo = () => {
  const image = useSharedValue(null);
  useEffect(() => {
    runOnUI(createTexture)(image);
  }, []);

  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={image} x={0} y={0} width={200} height={200} />
    </Canvas>
  );
};
export default RunOnUIDemo;
