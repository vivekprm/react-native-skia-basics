import {
  Canvas,
  Circle,
  Fill,
  Group,
  RoundedRect,
} from "@shopify/react-native-skia";
import { SafeAreaView, StyleSheet, View, ViewComponent } from "react-native";
import PaintProperties from "./PaintProperties";
import SimpleTransformation from "./SimpleTransformation";
import OriginTransformation from "./OriginTransformation";
import ClipRectangle from "./ClipRectangle";
import ClipRoundedRectangle from "./ClipRoundedRectangle";
import ClipPath from "./ClipPath";
import InvertClip from "./InvertClip";
import LayerEffect from "./LayerEffect";
import SVGFitBox from "./FitBox";

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
      <SVGFitBox />
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
