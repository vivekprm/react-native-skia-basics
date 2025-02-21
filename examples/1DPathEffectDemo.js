import { Canvas, Path1DPathEffect, Path } from "@shopify/react-native-skia";

const logo =
  "M133.5 112.6c-1.1.2-10.5 1.3-21 2.5-21.1 2.5-22.9 3.1-32.2 10.8-6 5-6.2 5.1-12.6 5.1-9.3 0-9.7.3-9.7 6.6v5.4h5.3c20.2 0 41.1 14.8 49.3 35 3.6 8.8 4.6 27.4 1.9 36.6-5.5 19.3-20.6 33.9-40 38.9-3.2.8-7.6 1.5-9.7 1.5H61v29h32v-20.1l4.3.3 4.2.3.3 9.7.3 9.8H186l-.5-2.8c-.3-1.5-3.2-18.7-6.5-38.2-5.9-35.7-13.2-73.8-19.6-103.5-5.3-24.6-10-29.4-25.9-26.9zM144 255v11h-8v-22h8v11z";

const Path1DEffectDemo = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Path path={logo} color="#61DAFB" style="stroke" strokeWidth={15}>
        <Path1DPathEffect
          path="M -10 0 L 0 -10, 10 0, 0 10 Z"
          advance={20}
          phase={0}
          style="rotate"
        />
      </Path>
    </Canvas>
  );
};
export default Path1DEffectDemo;
