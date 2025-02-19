import { useMemo } from "react";
import {
  Paragraph,
  Skia,
  useFonts,
  Canvas,
  Rect,
  TileMode,
} from "@shopify/react-native-skia";
// Our background shader
const source = Skia.RuntimeEffect.Make(`
uniform vec4 position;
uniform vec4 colors[4];
vec4 main(vec2 pos) {
  vec2 uv = (pos - vec2(position.x, position.y))/vec2(position.z, position.w);
  vec4 colorA = mix(colors[0], colors[1], uv.x);
  vec4 colorB = mix(colors[2], colors[3], uv.x);
  return mix(colorA, colorB, uv.y);
}`);
// Define an array of colors for the gradient to be used in shader uniform
const colors = [
  // #dafb61
  0.85, 0.98, 0.38, 1.0,
  // #61dafb
  0.38, 0.85, 0.98, 1.0,
  // #fb61da
  0.98, 0.38, 0.85, 1.0,
  // #61fbcf
  0.38, 0.98, 0.81, 1.0,
];
const ParagraphPaintDemo = () => {
  const paragraph = useMemo(() => {
    // Create a background paint.
    const backgroundPaint = Skia.Paint();
    backgroundPaint.setShader(source.makeShader([0, 0, 256, 256, ...colors]));
    // Create a foreground paint. We use a radial gradient.
    const foregroundPaint = Skia.Paint();
    foregroundPaint.setShader(
      Skia.Shader.MakeRadialGradient(
        { x: 0, y: 0 },
        256,
        [Skia.Color("magenta"), Skia.Color("yellow")],
        null,
        TileMode.Clamp
      )
    );
    const para = Skia.ParagraphBuilder.Make()
      .pushStyle(
        {
          fontFamilies: ["Roboto"],
          fontSize: 72,
          fontStyle: { weight: 500 },
          color: Skia.Color("black"),
        },
        foregroundPaint,
        backgroundPaint
      )
      .addText("Say Hello to React Native Skia")
      .pop()
      .build();
    return para;
  }, []);
  return (
    <Canvas style={{ width: 256, height: 356 }}>
      <Paragraph paragraph={paragraph} x={0} y={0} width={256} />
    </Canvas>
  );
};

export default ParagraphPaintDemo;
