import {
  Canvas,
  ColorMatrix,
  Image,
  useImage,
  Lerp,
} from "@shopify/react-native-skia";
const MatrixColorLerpFilter = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  const blackAndWhite = [
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ];
  const purple = [
    1, -0.2, 0, 0, 0, 0, 1, 0, -0.1, 0, 0, 1.2, 1, 0.1, 0, 0, 0, 1.7, 1, 0,
  ];
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image x={0} y={0} width={256} height={256} image={image} fit="cover">
        <Lerp t={0.5}>
          <ColorMatrix matrix={purple} />
          <ColorMatrix matrix={blackAndWhite} />
        </Lerp>
      </Image>
    </Canvas>
  );
};
export default MatrixColorLerpFilter;
