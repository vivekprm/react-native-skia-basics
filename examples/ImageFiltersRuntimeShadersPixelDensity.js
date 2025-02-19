import {
  Canvas,
  Text,
  RuntimeShader,
  Skia,
  Group,
  Circle,
  Paint,
  Fill,
  useFont,
} from "@shopify/react-native-skia";
import { PixelRatio } from "react-native";
const pd = PixelRatio.get();

const source = Skia.RuntimeEffect.Make(`
uniform shader image;
half4 main(float2 xy) {
  if (xy.x < 256 * ${pd}/2) {
    return color;
  }
  return image.eval(xy).rbga;
}
`);
export const ImageFiltersRuntimeShaderPixelDensity = () => {
  const r = 128;
  const font = useFont(require("../assets/fonts/SFPro-Regular.otf"), 24);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group transform={[{ scale: 1 / pd }]}>
        <Group
          layer={
            <Paint>
              <RuntimeShader source={source} />
            </Paint>
          }
          transform={[{ scale: pd }]}
        >
          <Fill color="#b7c9e2" />
          <Text text="Hello World" x={16} y={32} color="#e38ede" font={font} />
        </Group>
      </Group>
    </Canvas>
  );
};
