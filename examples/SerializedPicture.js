import React, { useMemo } from "react";
import {
  createPicture,
  Canvas,
  Picture,
  Skia,
  Group,
} from "@shopify/react-native-skia";
export const SerializedPicture = () => {
  // Create picture
  const picture = useMemo(
    () =>
      createPicture(
        (canvas) => {
          const paint = Skia.Paint();
          paint.setColor(Skia.Color("pink"));
          canvas.drawRect({ x: 0, y: 0, width: 100, height: 100 }, paint);
          const circlePaint = Skia.Paint();
          circlePaint.setColor(Skia.Color("orange"));
          canvas.drawCircle(50, 50, 50, circlePaint);
        },
        { width: 100, height: 100 }
      ),
    []
  );
  // Serialize the picture
  const serialized = useMemo(() => picture.serialize(), [picture]);
  // Create a copy from serialized data
  const copyOfPicture = useMemo(
    () => (serialized ? Skia.Picture.MakePicture(serialized) : null),
    [serialized]
  );
  return (
    <Canvas style={{ width: 300, height: 256 }}>
      <Picture picture={picture} />
      <Group transform={[{ translateX: 200 }]}>
        {copyOfPicture && <Picture picture={copyOfPicture} />}
      </Group>
    </Canvas>
  );
};
export default SerializedPicture;
