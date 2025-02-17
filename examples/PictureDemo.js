import React, { useMemo } from "react";
import {
  createPicture,
  Canvas,
  Picture,
  Skia,
  Group,
  BlendMode,
} from "@shopify/react-native-skia";
export const PictureDemo = () => {
  // Create a picture
  const picture = useMemo(
    () =>
      createPicture((canvas) => {
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
      }),
    []
  );
  return (
    <>
      <Canvas style={{ width: 256, height: 256 }}>
        <Picture picture={picture} />
      </Canvas>
      <Canvas style={{ width: 256, height: 256 }}>
        <Picture picture={picture} />
      </Canvas>
    </>
  );
};
