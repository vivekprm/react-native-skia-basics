import { useState, useRef } from "react";
import { View, Text, PixelRatio, StyleSheet, Pressable } from "react-native";
import { makeImageFromView, Canvas, Image } from "@shopify/react-native-skia";
const pd = PixelRatio.get();
const SnapshotDemo = () => {
  // Create a ref for the view you'd like to take a snapshot of
  const ref = useRef(null);
  // Create a state variable to store the snapshot
  const [image, setImage] = useState(null);
  // Create a function to take the snapshot
  const onPress = async () => {
    // Take the snapshot of the view
    const snapshot = await makeImageFromView(ref);
    setImage(snapshot);
  };
  return (
    <View style={{ flex: 1 }}>
      <Pressable onPress={onPress}>
        <View
          ref={ref}
          // collapsable={false} is important here
          collapsable={false}
          style={{ backgroundColor: "cyan", flex: 1 }}
        >
          <Text>This is a React Native View</Text>
        </View>
      </Pressable>
      {image && (
        <Canvas style={StyleSheet.absoluteFill}>
          <Image
            image={image}
            x={0}
            y={0}
            width={image.width() / pd}
            height={image.height() / pd}
          />
        </Canvas>
      )}
    </View>
  );
};
export default SnapshotDemo;
