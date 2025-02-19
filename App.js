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
import PatchDemo from "./examples/PatchDemo";
import { PictureDemo } from "./examples/PictureDemo";
import BlurPictureDemo from "./examples/BlurPictureDemo";
import SerializedPicture from "./examples/SerializedPicture";
import ImagesDemo from "./examples/ImagesDemo";
import ImageSampling from "./examples/ImageSampling";
import AnimatedImagesDemo from "./examples/AnimatedImages";
import ImageSVGDemo from "./examples/ImageSVGDemo";
import SVGOpacityDemo from "./examples/SVGOpacityDemo";
import SVGBlurDemo from "./examples/SVGBlurDemo";
import SnapshotDemo from "./examples/SnapshotDemo";
import { VideoExample } from "./examples/VideoExample";
import ParagraphDemo from "./examples/ParagraphDemo";
import ParagraphPaintDemo from "./examples/ParagraphPaintDemo";
import TextEffectsDemo from "./examples/TextEffectsDemo";
import ParagraphBoundingBoxDemo from "./examples/ParagraphBoundingBoxDemo";
import ParagraphStylingDemo from "./examples/ParagraphStylingDemo";
import ParagraphTextStylingDemo from "./examples/ParagraphTextStylingDemo";
import { SimpleTextDemo } from "./examples/SimpleTextDemo";
import TextFontStylingDemo from "./examples/TextFontStylingDemo";
import { TextGlyphsDemo } from "./examples/TextGlyphsDemo";
import { TextPathDemo } from "./examples/TextPathDemo";
import TextBlobDemo from "./examples/TextBlobDemo";
import SimpleShaderDemo from "./examples/SimpleShaderDemo";
import UniformShaderDemo from "./examples/UniformShaderDemo";
import NestedShaderDemo from "./examples/NestedShaderDemo";
import ImageShaderDemo from "./examples/ImageShaderDemo";

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
      {/* <IndicesDemo /> */}
      {/* <PatchDemo /> */}
      {/* <PictureDemo /> */}
      {/* <BlurPictureDemo /> */}
      {/* <SerializedPicture /> */}
      {/* <ImagesDemo /> */}
      {/* <ImageSampling /> */}
      {/* <AnimatedImagesDemo /> */}
      {/* <ImageSVGDemo /> */}
      {/* <SVGOpacityDemo /> */}
      {/* <SVGBlurDemo /> */}
      {/* <SnapshotDemo /> */}
      {/* <VideoExample /> */}
      {/* <ParagraphDemo /> */}
      {/* <ParagraphPaintDemo /> */}
      {/* <TextEffectsDemo /> */}
      {/* <ParagraphBoundingBoxDemo /> */}
      {/* <ParagraphStylingDemo /> */}
      {/* <ParagraphTextStylingDemo /> */}
      {/* <SimpleTextDemo /> */}
      {/* <TextFontStylingDemo /> */}
      {/* <TextGlyphsDemo /> */}
      {/* <TextPathDemo /> */}
      {/* <TextBlobDemo /> */}
      {/* <SimpleShaderDemo /> */}
      {/* <UniformShaderDemo /> */}
      {/* <NestedShaderDemo /> */}
      <ImageShaderDemo />
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
