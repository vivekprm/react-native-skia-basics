React Native Skia brings the [Skia Graphics Library](https://skia.org/) to React Native. Skia serves as the graphics engine for Google Chrome and Chrome OS, Android, Flutter, Mozilla Firefox, Firefox OS, and many other products.

# Installation
Install skia:
```sh
npx expo install @shopify/react-native-skia
```

# Hello World
```js
import React from "react";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
 
const App = () => {
  const width = 256;
  const height = 256;
  const r = width * 0.33;
  return (
    <Canvas style={{ width, height }}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={width - r} cy={r} r={r} color="magenta" />
        <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
      </Group>
    </Canvas>
  );
};
 
export default App;
```

# Setup For Web
To run it for web install below packages:

```sh
npx expo install react-dom react-native-web @expo/metro-runtime
```

Setup post install script as follows:
```json
"postinstall": "npx setup-skia-web public"
```

And run ```npm install``` to run this script. It should create a public folder with ```canvaskit.wasm``` file which is used to run it on web. Now modify index.js as follows to make it work on web and mobile devices:
```js
import { registerRootComponent } from "expo";
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Platform } from "react-native";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
if (Platform.OS === "web") {
    LoadSkiaWeb({ locatefile: () => "/canvaskit.wasm" }).then(async () => {
        const App = (await import("./App")).default;
        registerRootComponent(App);
    });
} else {
    registerRootComponent(App);
}
```

Setup ```metro.config.js``` as follows:
```js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

config.resolver.assetExts.push("wasm");
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
```

If you encounter node path error:
Create a file ```path-fs-canvaskit-postinstall.js``` with below content:

```js
const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(
  __dirname,
  "node_modules",
  "canvaskit-wasm",
  "package.json"
);
const packageJson = require(packageJsonPath);

packageJson.browser = {
  fs: false,
  path: false,
  os: false,
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
```

And setup post install script as below:
```json
"postinstall": "npx setup-skia-web public && node path-fs-canvaskit-postinstall.js"
```

# Canvas
The Canvas component is the root of your Skia drawing. You can treat it as a regular React Native view and assign a view style. Behind the scenes, it is using its own React renderer.

## Getting the Canvas size
If the size of the Canvas is unknown, there are two ways to access it:

- On the JS thread, using the [onLayout](https://reactnative.dev/docs/view#onlayout) prop, like you would on any regular React Native View.
- On the UI thread, using the [onSize](https://shopify.github.io/react-native-skia/docs/animations/hooks#canvas-size) prop with [Reanimated](https://shopify.github.io/react-native-skia/docs/animations/animations).

## Getting a Canvas Snapshot
You can save your drawings as an image by using the ```makeImageSnapshotAsync``` method. This method returns a promise that resolves to an [Image](https://shopify.github.io/react-native-skia/docs/images). It executes on the UI thread, ensuring access to the same Skia context as your on-screen canvases, including [textures](https://shopify.github.io/react-native-skia/docs/animations/textures).

If your drawing does not contain textures, you may also use the synchronous ```makeImageSnapshot``` method for simplicity.

```js
import {useEffect} from "react";
import {Canvas, useCanvasRef, Circle} from "@shopify/react-native-skia";
 
export const Demo = () => {
  const ref = useCanvasRef();
  useEffect(() => {
    setTimeout(() => {
      // you can pass an optional rectangle
      // to only save part of the image
      const image = ref.current?.makeImageSnapshot();
      if (image) {
        // you can use image in an <Image> component
        // Or save to file using encodeToBytes -> Uint8Array
        const bytes = image.encodeToBytes();
      }
    }, 1000)
  });
  return (
    <Canvas style={{ flex: 1 }} ref={ref}>
      <Circle r={128} cx={128} cy={128} color="red" />
    </Canvas>
  );
};
```

## Accessibilty
The Canvas component supports the same properties as a View component including its [accessibility properties](https://reactnative.dev/docs/accessibility#accessible). You can make elements inside the canvas accessible as well by overlayings views on top of your canvas. This is the same recipe used for [applying gestures on specific canvas elements](https://shopify.github.io/react-native-skia/docs/animations/gestures/#element-tracking).

## Contexts
React Native Skia is using its own React renderer. It is currently impossible to automatically share a React context between two renderers. This means that a React Native context won't be available from your drawing directly. We recommend preparing the data needed for your drawing outside the <Canvas> element. However, if you need to use a React context within your drawing, you must re-inject it.

We found [its-fine](https://github.com/pmndrs/its-fine), also used by [react-three-fiber](https://github.com/pmndrs/react-three-fiber), to provide an elegant solution to this problem.

### Using its-fine
```js
import React from "react";
import { Canvas, Fill } from "@shopify/react-native-skia";
import {useTheme, ThemeProvider, ThemeContext} from "./docs/getting-started/Theme";
import { useContextBridge, FiberProvider } from "its-fine";
 
const MyDrawing = () => {
  const { primary } = useTheme();
  return <Fill color={primary} />;
};
 
export const Layer = () => {
  const ContextBridge = useContextBridge();
  return (
    <Canvas style={{ flex: 1 }}>
      <ContextBridge>
        <Fill color="black" />
        <MyDrawing />
      </ContextBridge>
    </Canvas>
  );
};
 
export const App = () => {
  return (
    <FiberProvider>
      <ThemeProvider primary="red">
        <Layer />
      </ThemeProvider>
    </FiberProvider>
  );
};
```

Below is the context definition that was used in this example:
```js
import type { ReactNode } from "react";
import React, { useContext, createContext } from "react";
 
interface Theme {
  primary: string;
}
 
export const ThemeContext = createContext<Theme | null>(null);
 
export const ThemeProvider = ({
  primary,
  children,
}: {
  primary: string;
  children: ReactNode;
}) => (
  <ThemeContext.Provider value={{ primary }}>
    {children}
  </ThemeContext.Provider>
);
 
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (theme === null) {
    throw new Error("Theme provider not found");
  }
  return theme;
};
```

# Painting
Anytime you draw something in Skia, you want to specify what color it is, how it blends with the background, or what style to draw it in. We call these painting attributes. And in React Native Skia, these attributes can be specified as properties or as children of a drawing component (```<Rect />```, or ```<Circle />``` for instance) or a ```<Group />```. There is also a ```<Paint />``` component which can be assigned directly to a drawing or group via its reference.

The following painting attributes can be assigned as properties:
- [color](https://shopify.github.io/react-native-skia/docs/paint/properties#color)
- [blendMode](https://shopify.github.io/react-native-skia/docs/paint/properties#blendmode)
- [style](https://shopify.github.io/react-native-skia/docs/paint/properties#style)
- [strokeWidth](https://shopify.github.io/react-native-skia/docs/paint/properties#strokewidth)
- [strokeJoin](https://shopify.github.io/react-native-skia/docs/paint/properties#strokejoin)
- [strokeCap](https://shopify.github.io/react-native-skia/docs/paint/properties#strokecap)
- [strokeMiter](https://shopify.github.io/react-native-skia/docs/paint/properties#strokemiter)
- [opacity](https://shopify.github.io/react-native-skia/docs/paint/properties#opacity)
- [antiAlias](https://shopify.github.io/react-native-skia/docs/paint/properties#antialias)

The following painting attributes can be assigned as children:
- [Shaders](https://shopify.github.io/react-native-skia/docs/shaders/overview)
- [Image Filters](https://shopify.github.io/react-native-skia/docs/image-filters/overview)
- [Color Filters](https://shopify.github.io/react-native-skia/docs/color-filters)
- [Mask Filters](https://shopify.github.io/react-native-skia/docs/mask-filters)
- [Path Effects](https://shopify.github.io/react-native-skia/docs/path-effects)

## Fills and Strokes
In Skia, a paint has a style property to indicate whether it is a fill or a stroke paint. When drawing something, you can pass Paint components as children to add strokes and fills. In the example below, the circle has one light blue fill and two stroke paints.

```js
import {Canvas, Circle, Paint, vec} from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const PaintDemo = () => {
  const strokeWidth = 10;
  const c = vec(width / 2, height / 2);
  const r = (width - strokeWidth) / 2;
  return (
    <Canvas style={{ width, height}}>
       <Circle c={c} r={r} color="red">
        <Paint color="lightblue" />
        <Paint color="#adbce6" style="stroke" strokeWidth={strokeWidth} />
        <Paint color="#ade6d8" style="stroke" strokeWidth={strokeWidth / 2} />
      </Circle>
    </Canvas>
  );
};
```

## Inheritance
Descendants inherit the paint attributes. In the example below, the first circle will be filled with a light blue color, and the second circle will have a light blue stroke.

```js
import {Canvas, Circle, Paint, Group} from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const PaintDemo = () => {
  const r = width / 6;
  return (
    <Canvas style={{ width, height }}>
      <Group color="lightblue">
        <Circle cx={r} cy={r} r={r} />
        <Group style="stroke" strokeWidth={10}>
          <Circle cx={3 * r} cy={3 * r} r={r} />
        </Group>
      </Group>
    </Canvas>
  );
};
```

Complex painting attributes like a shader or an image filter can be passed as children to a group or a drawing.

```js
import {Canvas, Circle, Group, LinearGradient, vec} from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const PaintDemo = () => {
  const r = width/2;
  return (
    <Canvas style={{ width, height }}>
      <Circle cx={r} cy={r} r={r}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(2 * r, 2 * r)}
          colors={["#00ff87", "#60efff"]}
        />
      </Circle>
      <Group>
        <LinearGradient
          start={vec(2 * r, 2 * r)}
          end={vec(4 * r, 4 * r)}
          colors={["#0061ff", "#60efff"]}
        />
        <Circle cx={3 * r} cy={3 * r} r={r} />
      </Group>
    </Canvas>
  );
};
```

## Manual Paint Assignment
Finally, we can assign a ref to a Paint component for later use.

```js
import {Canvas, Circle, Paint, Skia} from "@shopify/react-native-skia";
const width = 256;
const height = 256;
const r = width / 2;
const paint = Skia.Paint();
paint.setColor(Skia.Color("lightblue"));
 
export const PaintDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle paint={paint} cx={r} cy={r} r={r} />
    </Canvas>
  );
};
```

## Painting Properties
Below are the properties of a Paint component. The following children can also be assigned to a Paint:
- [Shaders](https://shopify.github.io/react-native-skia/docs/shaders/overview)
- [Image Filters](https://shopify.github.io/react-native-skia/docs/image-filters/overview)
- [Color Filters](https://shopify.github.io/react-native-skia/docs/color-filters)
- [Mask Filters](https://shopify.github.io/react-native-skia/docs/mask-filters)
- [Path Effects](https://shopify.github.io/react-native-skia/docs/path-effects)

### color
Sets the alpha and RGB used when **stroking** and **filling**. The color is a string or a number. Any valid [CSS color](https://www.w3.org/TR/css-color-3/) value is supported.

```js
import {Group, Circle, vec} from "@shopify/react-native-skia";
 
<>
  <Group color="red">
    <Circle c={vec(0, 0)} r={100} />
  </Group>
  {/* 0xffff0000 is also red (format is argb) */}
  <Group color={0xffff0000}>
    <Circle c={vec(0, 0)} r={50} />
  </Group>
  {/* Any CSS color is valid */}
  <Group color="hsl(120, 100%, 50%)">
    <Circle c={vec(0, 0)} r={50} />
  </Group>
</>
```

### opacity
Replaces alpha, leaving RGBA unchanged. 0 means fully transparent, 1.0 means opaque. When setting opacity in a Group component, the alpha component of all descending colors will inherit that value.

```js
import {Canvas, Circle, Group, Paint, vec} from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
const strokeWidth = 30;
const r = width / 2 - strokeWidth / 2;
const c = vec(width / 2, height / 2);
 
export const OpacityDemo = () => {
  return (
    <Canvas style={{ width, height }}>
      <Group opacity={0.5}>
        <Circle c={c} r={r} color="red" />
        <Circle
          c={c}
          r={r}
          color="lightblue"
          style="stroke"
          strokeWidth={strokeWidth}
        />
        <Circle
          c={c}
          r={r}
          color="mint"
          style="stroke"
          strokeWidth={strokeWidth / 2}
        />
      </Group>
    </Canvas>
  );
};
```

### blendMode
Sets the blend mode that is, the mode used to combine source color with destination color. The following values are available: clear, src, dst, srcOver, dstOver, srcIn, dstIn, srcOut, dstOut, srcATop, dstATop, xor, plus, modulate, screen, overlay, darken, lighten, colorDodge, colorBurn, hardLight, softLight, difference, exclusion, multiply, hue, saturation, color, luminosity.

### style
The paint style can be ```fill``` (default) or ```stroke```.

### strokeWidth
Thickness of the pen used to outline the shape.

### strokeJoin
Sets the geometry drawn at the corners of strokes. Values can be ```bevel```, ```miter```, or ```round```.

### strokeCap
Returns the geometry drawn at the beginning and end of strokes. Values can be ```butt```, ```round```, or ```square```.

### strokeMiter
Limit at which a sharp corner is drawn beveled.

### antiAlias
Requests, but does not require, that edge pixels draw opaque or with partial transparency.

### dither
Requests, but does not require, to distribute color error.

# Group
The Group component is an essential construct in React Native Skia. Group components can be deeply nested with one another. It can apply the following operations to its children:
- [Paint properties](https://shopify.github.io/react-native-skia/docs/group#paint-properties)
- [Transformations](https://shopify.github.io/react-native-skia/docs/group#transformations)
- [Clipping operations](https://shopify.github.io/react-native-skia/docs/group#clipping-operations)
- [Bitmap Effects](https://shopify.github.io/react-native-skia/docs/group#bitmap-effects)

| Name          | Type                | Description                                                    |
| ------------- | ------------------- | -------------------------------------------------------------- |
| transform?    | Transform2d         | Same API that's in React Native except for two differences:    |
|               |                     | the default origin of the transformation is at the top-left    |
|               |                     | corner(React Native views use the center), and all rotations   |
|               |                     | are in radians.                                                |
| ------------- | ------------------- | -------------------------------------------------------------- |
| origin?       | Point               | Sets the origin of the transformation. This property is not    |
|               |                     | inherited by its children.                                     |
| ------------- | ------------------- | -------------------------------------------------------------- |
| clip?         | RectOrRRectOrPath   | Rectangle, rounded rectangle, or  Path to use to clip the      |
|               |                     | children.                                                      |
| ------------- | ------------------- | -------------------------------------------------------------- |
| invertClip?   | boolean             | Invert the clipping region: parts outside the clipping region  |
|               |                     | will be shown and, inside will be hidden.                      |
| ------------- | ------------------- | -------------------------------------------------------------- |
| layer?        | RefObject<Paint>    | Draws the children as a bitmap and applies the effects         |
|               |                     | provided by the paint.                                         |
| ------------- | ------------------- | -------------------------------------------------------------- |

The following three components are not being affected by the group properties. To apply paint effects on these component, you need to use [layer effects](https://shopify.github.io/react-native-skia/docs/group#layer-effects). In each component reference, we also document how to apply paint effects on them.
- [Picture](https://shopify.github.io/react-native-skia/docs/shapes/pictures#applying-effects)
- [SVG](https://shopify.github.io/react-native-skia/docs/images-svg#applying-effects)
- [Paragraph](https://shopify.github.io/react-native-skia/docs/text/paragraph#applying-effects)

## Paint Properties	
Its children will inherit all paint attributes applied to a group. These attributes can be properties like color or style or children like <Shader />, or <ImageFilter /> for instance (see painting).

```js
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
 
export const PaintDemo = () => {
  const r = 128;
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={r} cy={r} r={r} color="#51AFED" />
      {/* The paint is inherited by the following sibling and descendants. */}
      <Group color="lightblue" style="stroke" strokeWidth={10}>
        <Circle cx={r} cy={r} r={r / 2} />
        <Circle cx={r} cy={r} r={r / 3} color="white" />
      </Group>
    </Canvas>
  );
};
```

## Transformations
The transform property is identical to its [homonymous property in React Native](https://reactnative.dev/docs/transforms) except for one significant difference: in React Native, the origin of transformation is the center of the object, whereas it is the top-left position of the object in Skia.

The origin property is a helper to set the origin of the transformation. This property is not inherited by its children. All rotations are in radians.

### Simple Transformation
```js
import { Canvas, Fill, Group, RoundedRect } from "@shopify/react-native-skia";
 
const SimpleTransform = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="#e8f4f8" />
      <Group color="lightblue" transform={[{ skewX: Math.PI / 6 }]}>
        <RoundedRect x={64} y={64} width={128} height={128} r={10} />
      </Group>
    </Canvas>
  );
};
```

### Transformation of Origin
```js
import { Canvas, Fill, Group, RoundedRect } from "@shopify/react-native-skia";
 
const SimpleTransform = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="#e8f4f8" />
      <Group
        color="lightblue"
        origin={{ x: 128, y: 128 }}
        transform={[{ skewX: Math.PI / 6 }]}
      >
        <RoundedRect x={64} y={64} width={128} height={128} r={10} />
      </Group>
    </Canvas>
  );
};
```

### Clipping Operations
```clip``` provides a clipping region that sets what part of the children should be shown. Parts inside the region are shown, while those outside are hidden. When using ```invertClip```, everything outside the clipping region will be shown, and parts inside the clipping region will be hidden.

#### Clip Reactangle
```js
import {
  Canvas,
  Group,
  Image,
  useImage,
  rect,
  Fill,
} from "@shopify/react-native-skia";
 
const size = 256;
const padding = 32;
 
const Clip = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  const rct = rect(padding, padding, size - padding * 2, size - padding * 2);
 
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="lightblue" />
      <Group clip={rct}>
        <Image
          image={image}
          x={0}
          y={0}
          width={size}
          height={size}
          fit="cover"
        />
      </Group>
    </Canvas>
  );
};
```

#### Clip Rounded Rectangle
```js
import {
  Canvas,
  Group,
  Image,
  useImage,
  rrect,
  rect,
} from "@shopify/react-native-skia";
 
const size = 256;
const padding = 32;
const r = 8;
 
const Clip = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  const roundedRect = rrect(
    rect(padding, padding, size - padding * 2, size - padding * 2),
    r,
    r
  );
 
  return (
    <Canvas style={{ flex: 1 }}>
      <Group clip={roundedRect}>
        <Image
          image={image}
          x={0}
          y={0}
          width={size}
          height={size}
          fit="cover"
        />
      </Group>
    </Canvas>
  );
};
```

#### Clip Path
```js
import {
  Canvas,
  Group,
  Image,
  useImage,
  Skia,
} from "@shopify/react-native-skia";
 
const Clip = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  const star = Skia.Path.MakeFromSVGString(
    "M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
  )!;
 
  return (
    <Canvas style={{ flex: 1 }}>
      <Group clip={star}>
        <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      </Group>
    </Canvas>
  );
};
```

#### Invert Clip
```js
import {
  Canvas,
  Group,
  Image,
  useImage,
  Skia,
} from "@shopify/react-native-skia";
 
const Clip = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  const star = Skia.Path.MakeFromSVGString(
    "M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
  )!;
 
  return (
    <Canvas style={{ flex: 1 }}>
      <Group clip={star} invertClip>
        <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      </Group>
    </Canvas>
  );
};
```

#### Layer Effects
Using the ```layer``` property will create a bitmap drawing of the children. You can use it to apply effects. This is particularly useful to build effects that need to be applied to a group of elements and not one in particular.

```js
import {
  Canvas,
  Group,
  Circle,
  Blur,
  Paint,
  ColorMatrix,
} from "@shopify/react-native-skia";
 
const Clip = () => {
  return (
    <Canvas style={{ flex: 1 }}>
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
```

#### Fitbox
The FitBox component is based on the Group component and allows you to scale drawings to fit into a destination rectangle automatically.

| Name | Type         | Description                                         |
| ---- | ------------ | --------------------------------------------------- |
| src  | ```SKRect``` | Bounding rectangle of the drawing before scaling    |
| dst  | ```SKRect``` | Bounding rectangle of the drawing after scale       |
| fit? | ```FIT```    | Method to make the image fit into the rectangle.    |
|      |              | Value can be ```contain```, ```fill```, ```cover``` |
|      |              | ```fitHeight```, ```fitWidth```,                    |
|      |              | ```scaleDown```, ```none``` (default is contain)    |

#### Example
Consider the following SVG export. Its bounding source rectangle is ```0, 0, 664, 308```:

```js
<svg width="664" height="308" viewBox="0 0 664 308" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 170.1 215.5 C 165 222.3..." fill="black"/>
</svg>
```
We would like to automatically scale that path to our canvas of size 256 x 256:
```js
import { Canvas, FitBox, Path, rect } from "@shopify/react-native-skia";
 
const Hello = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <FitBox src={rect(0, 0, 664, 308)} dst={rect(0, 0, 256, 256)}>
        <Path
          path="M 170.1 215.5 C 165 222.3..."
          strokeCap="round"
          strokeJoin="round"
          style="stroke"
          strokeWidth={30}
        />
      </FitBox>
    </Canvas>
  );
};
```