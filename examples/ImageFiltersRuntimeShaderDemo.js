import {
  Canvas,
  Text,
  RuntimeShader,
  Skia,
  Group,
  Circle,
} from "@shopify/react-native-skia";
const source = Skia.RuntimeEffect.Make(`
uniform shader image;

half4 main(float2 xy) {
  return image.eval(xy).rbga;
}
`);
export const ImageFiltersRuntimeShaderDemo = () => {
  const r = 128;
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group>
        <RuntimeShader source={source} />
        <Circle cx={r} cy={r} r={r} color="lightblue" />
      </Group>
    </Canvas>
  );
};
