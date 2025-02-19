import React from "react";
import {
  Canvas,
  ImageSVG,
  Skia,
  rect,
  fitbox,
  useSVG,
  Group,
  Paint,
  Blur,
} from "@shopify/react-native-skia";
const width = 256;
const height = 256;
const SVGBlurDemo = () => {
  const tiger = useSVG(require("../assets/tiger.svg"));
  if (!tiger) {
    return null;
  }
  const src = rect(0, 0, tiger.width(), tiger.height());
  const dst = rect(0, 0, width, height);
  return (
    <Canvas style={{ width, height }}>
      <Group
        transform={fitbox("contain", src, dst)}
        layer={
          <Paint>
            <Blur blur={10} />
          </Paint>
        }
      >
        <ImageSVG svg={tiger} x={0} y={0} width={800} height={800} />
      </Group>
    </Canvas>
  );
};
export default SVGBlurDemo;
