import { useMemo } from "react";
import {
  Paragraph,
  Skia,
  useFonts,
  FontStyle,
  Canvas,
} from "@shopify/react-native-skia";
const ParagraphTextStylingDemo = () => {
  const customFontMgr = useFonts({
    Roboto: [
      require("../assets/fonts/Roboto-Italic.ttf"),
      require("../assets/fonts/Roboto-Regular.ttf"),
      require("../assets/fonts/Roboto-Bold.ttf"),
    ],
  });
  const paragraphData = useMemo(() => {
    // Are the custom fonts loaded?
    if (!customFontMgr) {
      return null;
    }
    const textStyle = {
      fontSize: 24,
      fontFamilies: ["Roboto"],
      color: Skia.Color("#000"),
    };
    const para = Skia.ParagraphBuilder.Make({}, customFontMgr)
      .pushStyle({ ...textStyle, fontStyle: FontStyle.Bold })
      .addText("This text is bold\n")
      .pop()
      .pushStyle({ ...textStyle, fontStyle: FontStyle.Normal })
      .addText("This text is regular\n")
      .pop()
      .pushStyle({ ...textStyle, fontStyle: FontStyle.Italic })
      .addText("This text is italic")
      .pop()
      .build();
    return para;
  }, [customFontMgr]);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Paragraph paragraph={paragraphData} x={0} y={0} width={300} />
    </Canvas>
  );
};
export default ParagraphTextStylingDemo;
