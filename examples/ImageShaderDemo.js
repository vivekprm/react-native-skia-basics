import {
  Canvas,
  Circle,
  ImageShader,
  Skia,
  Shader,
  useImage,
} from "@shopify/react-native-skia";
const ImageShaderDemo = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  if (image === null) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Circle cx={128} cy={128} r={128}>
        <ImageShader
          image={image}
          fit="cover"
          rect={{ x: 0, y: 0, width: 256, height: 256 }}
        />
      </Circle>
    </Canvas>
  );
};
export default ImageShaderDemo;
