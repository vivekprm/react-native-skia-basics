import React from "react";
import {
  Canvas,
  Skia,
  Group,
  Paint,
  Blur,
  Paragraph,
} from "@shopify/react-native-skia";
const width = 256;
const height = 256;
export const TextEffectsDemo = () => {
  const paragraph = Skia.ParagraphBuilder.Make()
    .pushStyle({
      color: Skia.Color("black"),
      fontSize: 25,
    })
    .addText("Hello Skia")
    .build();
  return (
    <Canvas style={{ width, height }}>
      <Group
        layer={
          <Paint>
            <Blur blur={2} />
          </Paint>
        }
      >
        <Paragraph paragraph={paragraph} x={0} y={0} width={width} />
      </Group>
    </Canvas>
  );
};
export default TextEffectsDemo;
