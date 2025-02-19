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
  OpacityMatrix,
  ColorMatrix,
} from "@shopify/react-native-skia";
const width = 256;
const height = 256;
export const SVGOpacityDemo = () => {
  const tiger = useSVG(require("../assets/tiger.svg"));
  if (!tiger) {
    console.log(tiger);
    return null;
  }
  const src = rect(0, 0, tiger.width(), tiger.height());
  const dst = rect(0, 0, width, height);
  return (
    <Canvas style={{ width: 2 * width, height }}>
      <Group
        transform={fitbox("contain", src, dst)}
        layer={
          <Paint>
            <ColorMatrix matrix={OpacityMatrix(0.5)} />
          </Paint>
        }
      >
        <ImageSVG svg={tiger} x={0} y={0} width={800} height={800} />
      </Group>
    </Canvas>
  );
};
export default SVGOpacityDemo;
