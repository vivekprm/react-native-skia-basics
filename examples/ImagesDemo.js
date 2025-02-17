import {
  AlphaType,
  Canvas,
  ColorType,
  Image,
  Skia,
  useImage,
} from "@shopify/react-native-skia";

const pixels = new Uint8Array(256 * 256 * 4);
pixels.fill(255);
let i = 0;
for (let x = 0; x < 256; x++) {
  for (let y = 0; y < 256; y++) {
    pixels[i++] = (x * y) % 255;
  }
}
const data = Skia.Data.fromBytes(pixels);
const img = Skia.Image.MakeImage(
  {
    width: 256,
    height: 256,
    alphaType: AlphaType.Opaque,
    colorType: ColorType.RGBA_8888,
  },
  data,
  256 * 4
);

const imgdata = Skia.Data.fromBase64(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
);
const base64image = Skia.Image.MakeImageFromEncoded(imgdata);

const ImagesDemo = () => {
  const image = useImage(require("../assets/oslo.jpg"));
  return (
    <>
      <Canvas style={{ width: 256, height: 256 }}>
        <Image
          image={image}
          fit="contain"
          x={0}
          y={0}
          width={256}
          height={256}
        />
      </Canvas>
      <Canvas style={{ width: 256, height: 256 }}>
        <Image image={img} fit="contain" x={0} y={0} width={256} height={256} />
      </Canvas>
      <Canvas style={{ width: 256, height: 256 }}>
        <Image
          image={base64image}
          fit="contain"
          x={0}
          y={0}
          width={256}
          height={256}
        />
      </Canvas>
    </>
  );
};
export default ImagesDemo;
