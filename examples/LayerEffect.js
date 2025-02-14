import {
  Canvas,
  Group,
  Circle,
  Blur,
  Paint,
  ColorMatrix,
} from "@shopify/react-native-skia";
const LayerEffect = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Group
        color="lightblue"
        layer={
          <Paint>
            <Blur blur={20} />
            <ColorMatrix
              matrix={[
                1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 18, -7,
              ]}
            />
          </Paint>
        }
      >
        <Circle cx={0} cy={128} r={128 * 0.95} />
        <Circle cx={256} cy={128} r={128 * 0.95} />
      </Group>
    </Canvas>
  );
};

export default LayerEffect;
