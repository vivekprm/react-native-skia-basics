import {
  Canvas,
  Skia,
  ImageShader,
  Shader,
  Fill,
  useImage,
} from "@shopify/react-native-skia";
const source = Skia.RuntimeEffect.Make(`
uniform shader image;

half4 main(float2 xy) {   
  xy.x += sin(xy.y / 3) * 4;
  return image.eval(xy).rbga;
}`);
const NestedShaderDemo = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill>
        <Shader source={source}>
          <ImageShader
            image={image}
            fit="cover"
            rect={{ x: 0, y: 0, width: 256, height: 256 }}
          />
        </Shader>
      </Fill>
    </Canvas>
  );
};
export default NestedShaderDemo;
