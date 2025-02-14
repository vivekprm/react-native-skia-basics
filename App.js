import { SafeAreaView, StyleSheet } from "react-native";
import PathDemo from "./examples/PathDemo";
import TrimSVGPath from "./examples/TrimSVGPath";
import FillTypeDemo from "./examples/FillTypeDemo";

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
      <FillTypeDemo />
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
