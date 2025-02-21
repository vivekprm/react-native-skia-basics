import { useWindowDimensions } from "react-native";
import { usePictureAsTexture } from "@shopify/react-native-skia";
import {
  Image,
  Rect,
  rect,
  Canvas,
  Fill,
  Skia,
} from "@shopify/react-native-skia";
import React from "react";
const rec = Skia.PictureRecorder();
const canvas = rec.beginRecording();
canvas.drawColor(Skia.Color("cyan"));
const picture = rec.finishRecordingAsPicture();
const UsePictureAsTextureAnimation = () => {
  const { width, height } = useWindowDimensions();
  const texture = usePictureAsTexture(picture, { width, height });
  return (
    <Canvas style={{ width, height }}>
      <Image image={texture} rect={{ x: 0, y: 0, width, height }} />
    </Canvas>
  );
};
export default UsePictureAsTextureAnimation;
