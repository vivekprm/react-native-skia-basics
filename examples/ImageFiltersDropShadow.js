import { Shadow, Fill, RoundedRect, Canvas } from "@shopify/react-native-skia";
const ImageFiltersDropShadow = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <RoundedRect
        x={32}
        y={32}
        width={192}
        height={192}
        r={32}
        color="lightblue"
      >
        <Shadow dx={12} dy={12} blur={25} color="#93b8c4" />
        <Shadow dx={-12} dy={-12} blur={25} color="#c7f8ff" />
      </RoundedRect>
    </Canvas>
  );
};

export default ImageFiltersDropShadow;
