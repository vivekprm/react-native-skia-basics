import { Canvas, Glyphs, vec, useFont } from "@shopify/react-native-skia";
export const TextGlyphsDemo = () => {
  const fontSize = 32;
  const font = useFont(require("../assets/fonts/Roboto-Medium.ttf"), fontSize);
  if (font === null) {
    return null;
  }
  const glyphs = font
    .getGlyphIDs("Hello World!")
    .map((id, i) => ({ id, pos: vec(0, (i + 1) * fontSize) }));
  return (
    <Canvas style={{ width: 256, height: 356 }}>
      <Glyphs font={font} glyphs={glyphs} />
    </Canvas>
  );
};
