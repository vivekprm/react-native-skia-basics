import { SafeAreaView, StyleSheet } from "react-native";
import PathDemo from "./examples/PathDemo";
import TrimSVGPath from "./examples/TrimSVGPath";
import FillTypeDemo from "./examples/FillTypeDemo";
import RectDemo from "./examples/RectDemo";
import RoundedRectDemo from "./examples/RoundedRectDemo";
import CustomRoundedRectDemo from "./examples/CustomRoundedRectDemo";
import DiffRectDemo from "./examples/DiffRectDemo";
import LineDemo from "./examples/LineDemo";
import PointsDemo from "./examples/PointsDemo";
import VerticesDemo from "./examples/VerticesDemo";
import IndicesDemo from "./examples/IndicesDemo";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <PaintProperties /> */}
      {/* <SimpleTransformation /> */}
      {/* <OriginTransformation /> */}
      {/* <ClipRectangle /> */}
      {/* <ClipRoundedRectangle /> */}
      {/* <ClipPath /> */}
      {/* <InvertClip /> */}
      {/* <LayerEffect /> */}
      {/* <SVGFitBox /> */}
      {/* <SVGNotation /> */}
      {/* <PathDemo /> */}
      {/* <TrimSVGPath /> */}
      {/* <FillTypeDemo /> */}
      {/* <RectDemo /> */}
      {/* <RoundedRectDemo /> */}
      {/* <CustomRoundedRectDemo /> */}
      {/* <DiffRectDemo /> */}
      {/* <LineDemo /> */}
      {/* <PointsDemo /> */}
      <IndicesDemo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
export default App;
