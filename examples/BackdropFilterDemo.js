import {
  Canvas,
  BackdropFilter,
  Image,
  ColorMatrix,
  useImage,
} from "@shopify/react-native-skia";
// https://kazzkiq.github.io/svg-color-filter/
const BLACK_AND_WHITE = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
];
const BackdropFilterDemo = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      <BackdropFilter
        clip={{ x: 0, y: 128, width: 256, height: 128 }}
        filter={<ColorMatrix matrix={BLACK_AND_WHITE} />}
      />
    </Canvas>
  );
};
export default BackdropFilterDemo;
