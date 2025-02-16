import { Canvas, Vertices, vec } from "@shopify/react-native-skia";
const IndicesDemo = () => {
  const vertices = [vec(0, 0), vec(256, 0), vec(256, 256), vec(0, 256)];
  const colors = ["#61DAFB", "#fb61da", "#dafb61", "#61fbcf"];
  const triangle1 = [0, 1, 2];
  const triangle2 = [0, 2, 3];
  const indices = [...triangle1, ...triangle2];
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Vertices vertices={vertices} colors={colors} indices={indices} />
    </Canvas>
  );
};
export default IndicesDemo;
