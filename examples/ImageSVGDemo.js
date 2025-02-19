import {
  Canvas,
  fitbox,
  Group,
  ImageSVG,
  rect,
  Skia,
  useSVG,
} from "@shopify/react-native-skia";

const width = 256;
const height = 256;

const circlesvg = Skia.SVG.MakeFromString(
  `<svg viewBox='0 0 20 20' width="20" height="20" xmlns='http://www.w3.org/2000/svg'>
      <circle cx='10' cy='10' r='10' fill='#00ffff'/>
    </svg>`
);

const src = rect(0, 0, circlesvg.width(), circlesvg.height());
const dst = rect(0, 0, width, height);

const inlinesvg = Skia.SVG.MakeFromString(
  `<svg viewBox='0 0 290 500' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='31' cy='325' r='120px' fill='#c02aaa'/>
    </svg>`
);

const ImageSVGDemo = () => {
  // Alternatively, you can pass an SVG URL directly
  // for instance: const svg = useSVG("https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg");
  const svg = useSVG(require("../assets/tiger.svg"));
  return (
    <>
      <Canvas style={{ width, height }}>
        {svg && <ImageSVG svg={svg} width={width} height={height} />}
      </Canvas>
      <Canvas style={{ width, height }}>
        <ImageSVG svg={inlinesvg} width={width} height={height} />
      </Canvas>
      <Canvas style={{ width, height }}>
        <Group transform={fitbox("contain", src, dst)}>
          <ImageSVG svg={circlesvg} x={0} y={0} width={20} height={20} />
        </Group>
      </Canvas>
    </>
  );
};
export default ImageSVGDemo;
