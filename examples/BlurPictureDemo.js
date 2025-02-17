import React from "react";
import {
  Canvas,
  Skia,
  Group,
  Paint,
  Blur,
  createPicture,
  BlendMode,
  Picture,
} from "@shopify/react-native-skia";
const width = 256;
const height = 256;
export const BlurPictureDemo = () => {
  const picture = createPicture((canvas) => {
    const size = 256;
    const r = 0.33 * size;
    const paint = Skia.Paint();
    paint.setBlendMode(BlendMode.Multiply);
    paint.setColor(Skia.Color("cyan"));
    canvas.drawCircle(r, r, r, paint);
    paint.setColor(Skia.Color("magenta"));
    canvas.drawCircle(size - r, r, r, paint);
    paint.setColor(Skia.Color("yellow"));
    canvas.drawCircle(size / 2, size - r, r, paint);
  });
  return (
    <Canvas style={{ width, height }}>
      <Group
        layer={
          <Paint>
            <Blur blur={10} />
          </Paint>
        }
      >
        <Picture picture={picture} />
      </Group>
    </Canvas>
  );
};
export default BlurPictureDemo;
