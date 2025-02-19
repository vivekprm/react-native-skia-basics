import { Canvas, Blur, Image, useImage } from "@shopify/react-native-skia";
const ImageFiltersBlurDemo = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image x={0} y={0} width={256} height={256} image={image} fit="cover">
        <Blur blur={4} />
      </Image>
    </Canvas>
  );
};
export default ImageFiltersBlurDemo;
