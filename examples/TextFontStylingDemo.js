import { useFonts, Text, matchFont, Canvas } from "@shopify/react-native-skia";
const TextFontStylingDemo = () => {
  const fontMgr = useFonts({
    Roboto: [
      require("../assets/fonts/Roboto-Medium.ttf"),
      require("../assets/fonts/Roboto-Regular.ttf"),
      require("../assets/fonts/Roboto-Bold.ttf"),
    ],
  });
  if (!fontMgr) {
    return null;
  }
  const fontStyle = {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
  };
  const font = matchFont(fontStyle, fontMgr);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Text text="Hello World" y={32} x={32} font={font} />
    </Canvas>
  );
};
export default TextFontStylingDemo;
