import {
  Canvas,
  Image,
  useImage,
  CubicSampling,
  FilterMode,
  MipmapMode,
} from "@shopify/react-native-skia";
const ImageSampling = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image
        image={image}
        fit="contain"
        x={0}
        y={0}
        width={256}
        height={256}
        sampling={CubicSampling}
      />
      <Image
        image={image}
        fit="contain"
        x={0}
        y={0}
        width={256}
        height={256}
        sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.Nearest }}
      />
    </Canvas>
  );
};

export default ImageSampling;
