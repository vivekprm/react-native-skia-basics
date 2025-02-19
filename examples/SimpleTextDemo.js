import { Canvas, Text, useFont, Fill } from "@shopify/react-native-skia";

export const SimpleTextDemo = () => {
  const fontSize = 32;
  const font = useFont(require("../assets/fonts/Roboto-Regular.ttf"), fontSize);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="white" />
      <Text x={0} y={fontSize} text="Hello World" font={font} />
    </Canvas>
  );
};
