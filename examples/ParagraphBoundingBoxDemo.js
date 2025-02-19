import { useMemo } from "react";
import {
  Paragraph,
  Skia,
  useFonts,
  Canvas,
  Rect,
} from "@shopify/react-native-skia";
const ParagraphBoundingBoxDemo = () => {
  const paragraph = useMemo(() => {
    const para = Skia.ParagraphBuilder.Make()
      .addText("Say Hello to React Native Skia")
      .build();
    // Calculate the layout
    para.layout(200);
    return para;
  }, []);
  // Now the paragraph height is available
  const height = paragraph.getHeight();
  const width = paragraph.getLongestLine();
  // Render the paragraph
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      {/* Maximum paragraph width */}
      <Rect x={0} y={0} width={200} height={256} color="magenta" />
      {/* Paragraph bounding box */}
      <Rect x={0} y={0} width={width} height={height} color="cyan" />
      <Paragraph paragraph={paragraph} x={0} y={0} width={200} />
    </Canvas>
  );
};
export default ParagraphBoundingBoxDemo;
