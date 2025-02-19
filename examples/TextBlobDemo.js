import {
  Canvas,
  TextBlob,
  Skia,
  useFont,
  size,
} from "@shopify/react-native-skia";

const TextBlobDemo = () => {
  const font = useFont(require("../assets/fonts/SFPro-Regular.otf"), 24);
  if (font === null) {
    return null;
  }
  const blob = Skia.TextBlob.MakeFromText("Hello World!", font);
  return (
    <Canvas style={{ width: 256, height: 256, backgroundColor: "black" }}>
      <TextBlob blob={blob} />
    </Canvas>
  );
};
export default TextBlobDemo;
