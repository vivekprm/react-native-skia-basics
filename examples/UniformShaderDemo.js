import { Canvas, Skia, Shader, Fill, vec } from "@shopify/react-native-skia";
const source = Skia.RuntimeEffect.Make(`
uniform vec2 c;
uniform float r;
uniform float blue;

vec4 main(vec2 pos) {
  vec2 normalized = pos/vec2(2 * r);
  return distance(pos, c) > r ? vec4(1) : vec4(normalized, blue, 1);
}`);
const UniformShaderDemo = () => {
  const r = 128;
  const c = vec(2 * r, r);
  const blue = 1.0;
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill>
        <Shader source={source} uniforms={{ c, r, blue }} />
      </Fill>
    </Canvas>
  );
};
export default UniformShaderDemo;
