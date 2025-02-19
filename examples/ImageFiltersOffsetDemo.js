import {
  Canvas,
  Image,
  Offset,
  useImage,
  Fill,
} from "@shopify/react-native-skia";
const ImageFiltersOffsetDemo = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover">
        <Offset x={64} y={64} />
      </Image>
    </Canvas>
  );
};
export default ImageFiltersOffsetDemo;
