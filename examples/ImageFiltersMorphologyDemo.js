import { Canvas, Text, Morphology, useFont } from "@shopify/react-native-skia";
export const ImageFiltersMorphologyDemo = () => {
  const font = useFont(require("../assets/fonts/SFPro-Regular.otf"), 24);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Text text="Hello World" x={32} y={32} font={font} />
      <Text text="Hello World" x={32} y={64} font={font}>
        <Morphology radius={1} />
      </Text>
      <Text text="Hello World" x={32} y={96} font={font}>
        <Morphology radius={0.3} operator="erode" />
      </Text>
    </Canvas>
  );
};
