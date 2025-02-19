import { useMemo } from "react";
import {
  Paragraph,
  Skia,
  TextAlign,
  Canvas,
  Rect,
  FontStyle,
} from "@shopify/react-native-skia";
const ParagraphStylingDemo = () => {
  const textStyle = {
    fontSize: 24,
    fontFamilies: ["Roboto"],
    color: Skia.Color("#a00"),
  };
  const paragraphData = useMemo(() => {
    const para = Skia.ParagraphBuilder.Make({
      textAlign: TextAlign.Center,
      textStyle,
    })
      .addText("Say Hello to React Native Skia")
      .build();
    return para;
  }, []);
  // Render the paragraph with the text center
  return (
    <Canvas style={{ width: 356, height: 256 }}>
      <Paragraph paragraph={paragraphData} x={0} y={10} width={300} />
    </Canvas>
  );
};
export default ParagraphStylingDemo;
