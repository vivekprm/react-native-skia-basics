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

# Shapes
## Path
In Skia, paths are semantically identical to [SVG Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths).

| Name   | Type             | Description                                                       |
| ------ | ---------------- | ----------------------------------------------------------------- |
| path   | SkPath or string | Path to draw. Can be a string using the SVG                       |
|        |                  | Path notation or an object created with Skia.Path.Make().         |
| start  | number           | Trims the start of the path. Value is in the                      |
|        |                  | range [0, 1] (default is 0).                                      |
| end    | number           | Trims the end of the path. Value is in                            |
|        |                  | the range [0, 1] (default is 1).                                  |
| stroke | StrokeOptions    | Turns this path into the filled                                   |
|        |                  | equivalent of the stroked path.                                   |
|        |                  | This will fail if the path is a hairline. StrokeOptions describes |
|        |                  | how the stroked path should look. It contains three properties:   |
|        |                  | width, strokeMiterLimit and, precision                            |

React Native Skia also provides [Path Effects](https://shopify.github.io/react-native-skia/docs/path-effects) and [Path hooks](https://shopify.github.io/react-native-skia/docs/animations/hooks) for animations.

### Using SVG Notation
```js
import {Canvas, Path} from "@shopify/react-native-skia";
 
const SVGNotation = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Path
        path="M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
        color="lightblue"
      />
    </Canvas>
  );
};
```

### Using Path Object
```js
import {Canvas, Path, Skia} from "@shopify/react-native-skia";
 
const path = Skia.Path.Make();
path.moveTo(128, 0);
path.lineTo(168, 80);
path.lineTo(256, 93);
path.lineTo(192, 155);
path.lineTo(207, 244);
path.lineTo(128, 202);
path.lineTo(49, 244);
path.lineTo(64, 155);
path.lineTo(0, 93);
path.lineTo(88, 80);
path.lineTo(128, 0);
path.close();
 
const PathDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Path
        path={path}
        color="lightblue"
      />
    </Canvas>
  );
};
```

### Trim Path
```js
import {Canvas, Path} from "@shopify/react-native-skia";
 
const SVGNotation = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Path
        path="M 128 0 L 168 80 L 256 93 L 192 155 L 207 244 L 128 202 L 49 244 L 64 155 L 0 93 L 88 80 L 128 0 Z"
        color="lightblue"
        style="stroke"
        strokeJoin="round"
        strokeWidth={5}
        // We trim the first and last quarter of the path
        start={0.25}
        end={0.75}
      />
    </Canvas>
  );
};
```

### Fill Type
The ```fillType``` property defines the algorithm to use to determine the inside part of a shape. Possible values are: ```winding```, ```evenOdd```, ```inverseWinding```, ```inverseEvenOdd```. Default value is ```winding```.

## Polygons
### Rect
Draws a rectangle.

| Name   | Type   | Description              |
| ------ | ------ | ------------------------ |
| x      | number | X coordinate.            |
| y      | number | Y coordinate.            |
| width  | number | Width of the rectangle.  |
| height | number | Height of the rectangle. |

```js
import { Canvas, Rect } from "@shopify/react-native-skia";
 
const RectDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256} color="lightblue" />
    </Canvas>
  );
};
```

### RoundedRect
Draws a rounded rectangle.

| Name   | Type             | Description                                            |
| ------ | ---------------- | ------------------------------------------------------ |
| x      | number           | X coordinate.                                          |
| y      | number           | Y coordinate.                                          |
| width  | number           | Width of the rectangle.                                |
| height | number           | Height of the rectangle.                               |
| r?     | number or Vector | Corner radius. Defaults to ```ry``` if specified or 0. |

```js
import { Canvas, RoundedRect } from "@shopify/react-native-skia";
 
const RectDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <RoundedRect
        x={0}
        y={0}
        width={256}
        height={256}
        r={25}
        color="lightblue"
      />
    </Canvas>
  );
};
```

### Using Custom Radii
You can set a different corner radius for each corner.

```js
import { Canvas, RoundedRect } from "@shopify/react-native-skia";
 
const RectDemo = () => {
  const size = 256;
  const r = size * 0.2;
  const rrct = {
    rect: { x: 0, y: 0, width: size, height: size },
    topLeft: { x: 0, y: 0 },
    topRight: { x: r, y: r },
    bottomRight: { x: 0, y: 0 },
    bottomLeft: { x: r, y: r },
  };
  return (
    <Canvas style={{ width: size, height: size }}>
      <RoundedRect
        rect={rrct}
        color="lightblue"
      />
    </Canvas>
  );
};
```

### DiffRect
Draws the difference between two rectangles.

| Name  | Type        | Description      |
| ----- | ----------- | ---------------- |
| outer | RectOrRRect | Outer rectangle. |
| inner | RectOrRRect | Inner rectangle. |

```js
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
 
const DRectDemo = () => {
  const outer = rrect(rect(0, 0, 256, 256), 25, 25);
  const inner = rrect(rect(50, 50, 256 - 100, 256 - 100), 50, 50);
  return (
    <Canvas style={{ flex: 1 }}>
      <DiffRect inner={inner} outer={outer} color="lightblue" />
    </Canvas>
  );
};
```

### Line
Draws a line between two points.

| Name | Type  | Description  |
| ---- | ----- | ------------ |
| p1   | Point | Start point. |
| p2   | Point | End point.   |

```js
import { Canvas, Line, vec } from "@shopify/react-native-skia";
 
const LineDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Line
        p1={vec(0, 0)}
        p2={vec(256, 256)}
        color="lightblue"
        style="stroke"
        strokeWidth={4}
      />
    </Canvas>
  );
};
```

### Points
Draws points and optionally draws the connection between them.

| Name   | Type      | Description                                                |
| ------ | --------- | ---------------------------------------------------------- |
| points | Point     | Points to draw.                                            |
| mode   | PointMode | How should the points be connected.                        |
|        |           | Can be points (no connection), lines (connect pairs        |
|        |           | of points), or polygon (connect lines). Default is points. |

```js
import { Canvas, Points, vec } from "@shopify/react-native-skia";
 
const PointsDemo = () => {
  const points = [
    vec(128, 0),
    vec(168, 80),
    vec(256, 93),
    vec(192, 155),
    vec(207, 244),
    vec(128, 202),
    vec(49, 244),
    vec(64, 155),
    vec(0, 93),
    vec(88, 80),
    vec(128, 0),
  ];
  return (
    <Canvas style={{ flex: 1 }}>
      <Points
        points={points}
        mode="polygon"
        color="lightblue"
        style="stroke"
        strokeWidth={4}
      />
    </Canvas>
  );
};
```

## Ellipses
https://shopify.github.io/react-native-skia/docs/shapes/ellipses

## Atlas
https://shopify.github.io/react-native-skia/docs/shapes/atlas

## Vertices
Draws vertices.

| Name       | Type       | Description                                                          |
| ---------- | ---------- | -------------------------------------------------------------------- |
| vertices   | Point[]    | Vertices to draw                                                     |
| mode?      | VertexMode | Can be triangles, triangleStrip or triangleFan. Default is triangles |
| indices?   | number[]   | Indices of the vertices that form the triangles. If not provided,    |
|            |            | the order of the vertices will be taken. Using this property enables |
|            |            | you not to duplicate vertices.                                       |
| textures   | Point[].   | [Texture mapping](https://en.wikipedia.org/wiki/Texture_mapping).The |
|            |            | texture is the shader provided by the paint.                         |
| colors?    | string[]   | Optional colors to be associated to each vertex                      |
| blendMode? | BlendMode  | If colors is provided, colors are blended with the paint using       |
|            |            | the blend mode. Default is dstOver if colors are                     |
|            |            | provided, srcOver if not.                                            |

## Using Texture Mapping
```js
import { Canvas, Group, ImageShader, Vertices, vec, useImage } from "@shopify/react-native-skia";
 
const VerticesDemo = () => {
  const image = useImage(require("./assets/squares.png"));
  const vertices = [vec(64, 0), vec(128, 256), vec(0, 256)];
  const colors = ["#61dafb", "#fb61da", "#dafb61"];
  const textures = [vec(0, 0), vec(0, 128), vec(64, 256)];
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      {/* This is our texture */}
      <Group>
        <ImageShader
          image={image}
          tx="repeat"
          ty="repeat"
        />
        {/* Here we specified colors, the default blendMode is dstOver */}
        <Vertices vertices={vertices} colors={colors} />
        <Group transform={[{ translateX: 128 }]}>
          {/* Here we didn't specify colors, the default blendMode is srcOver */}
          <Vertices vertices={vertices} textures={textures} />
        </Group>
      </Group>
    </Canvas>
  );
};
```

## Using indices
In the example below, we defined four vertices, representing four corners of a rectangle. Then we use the indices property to define the two triangles we would like to draw based on these four vertices.

First triangle: 0, 1, 2 (top-left, top-right, bottom-right).
Second triangle: 0, 2, 3 (top-left, bottom-right, bottom-left).

```js
import { Canvas, Vertices, vec } from "@shopify/react-native-skia";
 
const IndicesDemo = () => {
  const vertices = [vec(0, 0), vec(256, 0), vec(256, 256), vec(0, 256)];
  const colors = ["#61DAFB", "#fb61da", "#dafb61", "#61fbcf"];
  const triangle1 = [0, 1, 2];
  const triangle2 = [0, 2, 3];
  const indices = [...triangle1, ...triangle2];
  return (
    <Canvas style={{ flex: 1 }}>
      <Vertices vertices={vertices} colors={colors} indices={indices} />
    </Canvas>
  );
};
```

## Patch
Draws a [Coons patch](https://en.wikipedia.org/wiki/Coons_patch).

| Name       | Type           | Description                                                      |
| ---------- | -------------- | ---------------------------------------------------------------- |
| cubics     | CubicBezier[4] | Specifies four cubic Bezier starting at the top-left corner, in  |
|            |                | clockwise order, sharing every fourth point. The last            |
|            |                | cubic Bezier ends at the first point.                            |
| textures   | Point[]        | Texture mapping. The texture is the shader provided by the paint |
| colors?    | string[]       | Optional colors to be associated to each corner                  |
| blendMode? | BlendMode      | If colors is provided, colors are blended with the paint         |
|            |                | using the blend mode. Default is dstOver if colors are           |
|            |                | provided, srcOver if not                                         |

```js
import {Canvas, Patch, vec} from "@shopify/react-native-skia";
 
const PatchDemo = () => {
  const colors = ["#61dafb", "#fb61da", "#61fbcf", "#dafb61"];
  const C = 64;
  const width = 256;
  const topLeft = { pos: vec(0, 0), c1: vec(0, C), c2: vec(C, 0) };
  const topRight = {
    pos: vec(width, 0),
    c1: vec(width, C),
    c2: vec(width + C, 0),
  };
  const bottomRight = {
    pos: vec(width, width),
    c1: vec(width, width - 2 * C),
    c2: vec(width - 2 * C, width),
  };
  const bottomLeft = {
    pos: vec(0, width),
    c1: vec(0, width - 2 * C),
    c2: vec(-2 * C, width),
  };
  return (
    <Canvas style={{ flex: 1 }}>
      <Patch
        colors={colors}
        patch={[topLeft, topRight, bottomRight, bottomLeft]}
      />
    </Canvas>
  );
};
```

## Picture
A Picture renders a previously recorded list of drawing operations on the canvas. **The picture is immutable** and cannot be edited or changed after it has been created. It can be used multiple times in any canvas.

| Name    | Type            | Description       |
| ------- | --------------- | ----------------- |
| picture | ```SkPicture``` | Picture to render |

### Hello World
```js
import React, { useMemo } from "react";
import {
  createPicture,
  Canvas,
  Picture,
  Skia,
  Group,
  BlendMode
} from "@shopify/react-native-skia";
 
export const HelloWorld = () => {
  // Create a picture
  const picture = useMemo(() => createPicture(
    (canvas) => {
      const size = 256;
      const r = 0.33 * size;
      const paint = Skia.Paint();
      paint.setBlendMode(BlendMode.Multiply);
 
      paint.setColor(Skia.Color("cyan"));
      canvas.drawCircle(r, r, r, paint);
 
      paint.setColor(Skia.Color("magenta"));
      canvas.drawCircle(size - r, r, r, paint);
 
      paint.setColor(Skia.Color("yellow"));
      canvas.drawCircle(size / 2, size - r, r, paint);
    }
  ), []);
  return (
    <Canvas style={{ flex: 1 }}>
      <Picture picture={picture} />
    </Canvas>
  );
};
```

### Applying Effects
The ```Picture``` component doesn't follow the same painting rules as other components. However you can apply effets using the ```layer``` property. For instance, in the example below, fopr we apply a blur image filter.

```js
import React from "react";
import { Canvas, Skia, Group, Paint, Blur, createPicture, BlendMode, Picture } from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const Demo = () => {
  const picture = createPicture(
    (canvas) => {
      const size = 256;
      const r = 0.33 * size;
      const paint = Skia.Paint();
      paint.setBlendMode(BlendMode.Multiply);
 
      paint.setColor(Skia.Color("cyan"));
      canvas.drawCircle(r, r, r, paint);
 
      paint.setColor(Skia.Color("magenta"));
      canvas.drawCircle(size - r, r, r, paint);
 
      paint.setColor(Skia.Color("yellow"));
      canvas.drawCircle(size / 2, size - r, r, paint);
    }
  );
  return (
    <Canvas style={{ flex: 1 }}>
      <Group layer={<Paint><Blur blur={10} /></Paint>}>
        <Picture picture={picture} />
      </Group>
    </Canvas>
  );
};
```

### Serialization
You can serialize a picture to a byte array. Serialized pictures are only compatible with the version of Skia it was created with. You can use serialized pictures with the [Skia debugger](https://skia.org/docs/dev/tools/debugger/).

```js
import React, { useMemo } from "react";
import {
  createPicture,
  Canvas,
  Picture,
  Skia,
  Group,
} from "@shopify/react-native-skia";
 
export const PictureExample = () => {
  // Create picture
  const picture = useMemo(() => createPicture(
    (canvas) => {
      const paint = Skia.Paint();
      paint.setColor(Skia.Color("pink"));
      canvas.drawRect({ x: 0, y: 0, width: 100, height: 100 }, paint);
 
      const circlePaint = Skia.Paint();
      circlePaint.setColor(Skia.Color("orange"));
      canvas.drawCircle(50, 50, 50, circlePaint);
    },
    { width: 100, height: 100 },
  ), []);
 
  // Serialize the picture
  const serialized = useMemo(() => picture.serialize(), [picture]);
 
  // Create a copy from serialized data
  const copyOfPicture = useMemo(
    () => (serialized ? Skia.Picture.MakePicture(serialized) : null),
    [serialized]
  );
 
  return (
    <Canvas style={{ flex: 1 }}>
      <Picture picture={picture} />
      <Group transform={[{ translateX: 200 }]}>
        {copyOfPicture && <Picture picture={copyOfPicture} />}
      </Group>
    </Canvas>
  );
};
```

### Instance Methods
| Name       | Description                                                                   |
| ---------- | ----------------------------------------------------------------------------- |
| makeShader | Returns a new shader that will draw with this picture.                        |
| serialize  | Returns a UInt8Array representing the drawing operations stored in the image. |

# Images
## Loading Images
### useImage
Images are loaded using the ```useImage``` hook. This hook returns an ```SkImage``` instance, which can be passed to the ```Image``` component.

Images can be loaded using require statements or by passing a network URL directly. It is also possible to load images from the app bundle using named images.

```js
import { useImage } from "@shopify/react-native-skia";
// Loads an image from the JavaScript bundle
const image1 = useImage(require("./assets/oslo"));
// Loads an image from the network
const image2 = useImage("https://picsum.photos/200/300");
// Loads an image that was added to the Android/iOS bundle
const image3 = useImage("Logo");
```

Loading an image is an asynchronous operation, so the ```useImage``` hook will return null until the image is fully loaded. You can use this behavior to conditionally render the ```Image``` component, as shown in the [example below](https://shopify.github.io/react-native-skia/docs/images#example).

The hook also provides an optional error handler as a second parameter.

#### MakeImageFromEncoded
You can also create image instances manually using ```MakeImageFromEncoded```.
```js
import { Skia } from "@shopify/react-native-skia";
 
// A sample base64-encoded pixel
const data = Skia.Data.fromBase64("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==");
const image = Skia.Image.MakeImageFromEncoded(data);
```

#### MakeImage
```MakeImage``` allows you to create an image by providing pixel data and specifying the format.
```js
import { Skia, AlphaType, ColorType } from "@shopify/react-native-skia";
 
const pixels = new Uint8Array(256 * 256 * 4);
pixels.fill(255);
let i = 0;
for (let x = 0; x < 256; x++) {
  for (let y = 0; y < 256; y++) {
    pixels[i++] = (x * y) % 255;
  }
}
const data = Skia.Data.fromBytes(pixels);
const img = Skia.Image.MakeImage(
  {
    width: 256,
    height: 256,
    alphaType: AlphaType.Opaque,
    colorType: ColorType.RGBA_8888,
  },
  data,
  256 * 4
);
```

**Note**: The nested for-loops in the code sample above seem to have a mistake in the loop conditions. They should loop up to 256, not 256 * 4, as the pixel data array has been initialized with 256 * 256 * 4 elements representing a 256 by 256 image where each pixel is represented by 4 bytes (RGBA).

### useImage
```useImage``` is simply a helper function to load image data.

## Image Component
Images can be drawn by specifying the output rectangle and how the image should fit into that rectangle.

| Name      | Type     | Description                                                         |
| --------- | -------- | ------------------------------------------------------------------- |
| image     | SkImage  | An instance of the image.                                           |
| x         | number   | The left position of the destination image.                         |
| y         | number   | The top position of the destination image.                          |
| width     | number   | The width of the destination image.                                 |
| height    | number   | The height of the destination image.                                |
| fit?      | Fit      | The method used to fit the image into the rectangle.                |
|           |          | Values can be contain, fill, cover, fitHeight, fitWidth, scaleDown, |
|           |          | or none (the default is contain).                                   |
| sampling? | Sampling | The method used to sample the image. see (sampling options).        |

### Example
```js
import { Canvas, Image, useImage } from "@shopify/react-native-skia";
 
const ImageDemo = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  return (
    <Canvas style={{ flex: 1 }}>
      <Image image={image} fit="contain" x={0} y={0} width={256} height={256} />
    </Canvas>
  );
};
```

### Sampling Options
The ```sampling``` prop allows you to control how the image is sampled when it is drawn. Use ```cubic``` sampling for best quality: you can use the default ```sampling={CubicSampling}``` (defaults to ```{ B: 0, C: 0 }```) or any value you would like: ```sampling={{ B: 0, C: 0.5 }}```.

You can also use filter modes (```nearest``` or ```linear```) and mimap modes (```none```, ```nearest```, or ```linear```). Default is ```nearest```.

```js
import { Canvas, Image, useImage, CubicSampling, FilterMode, MipmapMode } from "@shopify/react-native-skia";
 
const ImageDemo = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  return (
    <Canvas style={{ flex: 1 }}>
      <Image
        image={image}
        fit="contain"
        x={0}
        y={0}
        width={256}
        height={256}
        sampling={CubicSampling}
      />
      <Image
        image={image}
        fit="contain"
        x={0}
        y={0}
        width={256}
        height={256}
        sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.Nearest }}
      />
    </Canvas>
  );
};
```

## Instance Methods
| Name           | Description                                                                |
| -------------- | -------------------------------------------------------------------------- |
| height         | Returns the possibly scaled height of the image.                           |
| width          | Returns the possibly scaled width of the image.                            |
| getImageInfo   | Returns the image info for the image.                                      |
| encodeToBytes  | Encodes the image pixels, returning the result as a UInt8Array.            |
| encodeToBase64 | Encodes the image pixels, returning the result as a base64-encoded string. |
| readPixels     | Reads the image pixels, returning result as UInt8Array or Float32Array     |

# Animated Images
React Native Skia supports animated images. Supported formats are ```GIF``` and animated ```WebP```.

## Using Reanimated
If you use Reanimated, we offer a ```useAnimatedImageValue``` hook that does everything automatically. ```useAnimatedImageValue``` returns a shared value that automatically updates on every frame.

In the example below, we display and animate a GIF using Reanimated. The shared value is first null, and once the image is loaded, it will update with an SkImage object on every frame.

```js
import React from "react";
import {
  Canvas,
  Image,
  useAnimatedImageValue,
} from "@shopify/react-native-skia";
 
export const AnimatedImages = () => {
  // This can be an animated GIF or WebP file
  const bird = useAnimatedImageValue(
    require("../assets/bird-flying.gif")
  );
  return (
      <Canvas
        style={{
          width: 320,
          height: 180,
        }}
      >
        <Image
          image={bird}
          x={0}
          y={0}
          width={320}
          height={180}
          fit="contain"
        />
      </Canvas>
  );
};
```

There is a second optional parameter available to control the pausing of the animation via a shared value.

```js
import React from "react";
import {Pressable} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import {
  Canvas,
  Image,
  useAnimatedImageValue,
} from "@shopify/react-native-skia";
 
export const AnimatedImages = () => {
  const isPaused = useSharedValue(false);
  // This can be an animated GIF or WebP file
  const bird = useAnimatedImageValue(
    require("../../assets/birdFlying.gif"),
    isPaused
  );
  return (
    <Pressable onPress={() => isPaused.value = !isPaused.value}>
      <Canvas
        style={{
          width: 320,
          height: 180,
        }}
      >
        <Image
          image={bird}
          x={0}
          y={0}
          width={320}
          height={180}
          fit="contain"
        />
      </Canvas>
    </Pressable>
  );
};
```

## Manual API
To load an image as a ```SkAnimatedImage``` object, we offer a ```useAnimatedImage``` hook:
```js
import {useAnimatedImage} from "@shopify/react-native-skia";
 
// bird is an SkAnimatedImage
const bird = useAnimatedImage(
  require("../../assets/birdFlying.gif")
)!;
// SkAnimatedImage offers 4 methods: decodeNextFrame(), getCurrentFrame(), currentFrameDuration(), and getFrameCount()
// getCurrentFrame() returns a regular SkImage
const image = bird.getCurrentFrame();
// decode the next frame
bird.decodeNextFrame();
// fetch the current frame number
const currentFrame = bird.currentFrameDuration();
// fetch the total number of frames
const frameCount = bird.getFrameCount();
```

# SVG Images
Draw an SVG (see [SVG Support](https://shopify.github.io/react-native-skia/docs/images-svg#svg-support)).

If the root dimensions are in absolute units, the width/height properties have no effect since the initial viewport is fixed.

| Name    | Type   | Description                                                          |
| ------- | ------ | -------------------------------------------------------------------- |
| svg     | SVG    | SVG Image.                                                           |
| width?  | number | Width of the destination image. This is used to resolve the initial  |
|         |        | viewport when the root SVG width is specified in relative units.     |
| height? | number | Height of the destination image. This is used to resolve the initial |
|         |        | viewport when the root SVG height is specified in relative units.    |
| x?      | number | Optional displayed x coordinate of the svg container.                |
| y?      | number | Optional displayed y coordinate of the svg container.                |

**INFO**
The ```ImageSVG``` component doesn't follow the same painting rules as other components. [see applying effects](https://shopify.github.io/react-native-skia/docs/images-svg#applying-effects).

```js
import {
  Canvas,
  ImageSVG,
  useSVG
} from "@shopify/react-native-skia";
 
const ImageSVGDemo = () => {
  // Alternatively, you can pass an SVG URL directly
  // for instance: const svg = useSVG("https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg");
  const svg = useSVG(require("../../assets/tiger.svg"));
  return (
    <Canvas style={{ flex: 1 }}>
      { svg && (
        <ImageSVG
          svg={svg}
          width={256}
          height={256}
        />)
      }
    </Canvas>
  );
};
```

You can also use an inlined string as SVG (using ```Skia.SVG.MakeFromString```):
```js
import React from "react";
import { Canvas, ImageSVG, Skia } from "@shopify/react-native-skia";
 
const svg = Skia.SVG.MakeFromString(
  `<svg viewBox='0 0 290 500' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='31' cy='325' r='120px' fill='#c02aaa'/>
  </svg>`
)!;
 
export const SVG = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <ImageSVG
        svg={svg}
        x={0}
        y={0}
        width={290}
        height={500}
      />
    </Canvas>
  );
};
```

## Scaling the SVG
As mentionned above, if the root dimensions are in absolute units, the width/height properties have no effect since the initial viewport is fixed. However you can access these values and use the ```fitbox``` function.

### Example
In the example below we scale the SVG to the canvas width and height.
```js
import React from "react";
import { Canvas, ImageSVG, Skia, rect, fitbox, Group } from "@shopify/react-native-skia";
 
const svg = Skia.SVG.MakeFromString(
  `<svg viewBox='0 0 20 20' width="20" height="20" xmlns='http://www.w3.org/2000/svg'>
    <circle cx='10' cy='10' r='10' fill='#00ffff'/>
  </svg>`
)!;
 
const width = 256;
const height = 256;
const src = rect(0, 0, svg.width(), svg.height());
const dst = rect(0, 0, width, height);
 
export const SVG = () => {
  return (
    <Canvas style={{ flex: 1 }}>
    <Group transform={fitbox("contain", src, dst)}>
      <ImageSVG svg={svg} x={0} y={0} width={20} height={20} />
      </Group>
    </Canvas>
  );
};
```

## Applying Effects
The ```ImageSVG``` component doesn't follow the same painting rules as other components. This is because behind the scene, we use the ```SVG``` module from Skia. However you can apply effets using the ```layer``` property.

### Opacity Example
In the example below we apply an opacity effect via the ```ColorMatrix``` component.

```js
import React from "react";
import { Canvas, ImageSVG, Skia, rect, fitbox, useSVG, Group, Paint, OpacityMatrix, ColorMatrix } from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const SVG = () => {
  const tiger = useSVG(require("./tiger.svg"));
  if (!tiger) {
    return null;
  }
  const src = rect(0, 0, tiger.width(), tiger.height());
  const dst = rect(0, 0, width, height);
  return (
    <Canvas style={{ flex: 1 }}>
      <Group
        transform={fitbox("contain", src, dst)}
        layer={<Paint><ColorMatrix matrix={OpacityMatrix(0.5)} /></Paint>}
      >
        <ImageSVG svg={tiger} x={0} y={0} width={800} height={800} />
      </Group>
    </Canvas>
  );
};
```

### Blur Example
In the example below we apply a blur image filter to the SVG.
```js
import React from "react";
import { Canvas, ImageSVG, Skia, rect, fitbox, useSVG, Group, Paint, Blur } from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const SVG = () => {
  const tiger = useSVG(require("./tiger.svg"));
  if (!tiger) {
    return null;
  }
  const src = rect(0, 0, tiger.width(), tiger.height());
  const dst = rect(0, 0, width, height);
  return (
    <Canvas style={{ flex: 1 }}>
      <Group transform={fitbox("contain", src, dst)} layer={<Paint><Blur blur={10} /></Paint>}>
        <ImageSVG svg={tiger} x={0} y={0} width={800} height={800} />
      </Group>
    </Canvas>
  );
};
```

## SVG Support
The [SVG module from Skia](https://github.com/google/skia/tree/main/modules/svg) displays SVGs as images. We expect most SVG files to render correctly out of the box, especially if they come from Figma or Illustrator. However, please be aware of some of the quirks below when using it. Text elements current won't render and any external XML elements such as XLink or CSS won't render. If your SVG doesn't render correctly and you've considered all the items below, please file [an issue](https://github.com/Shopify/react-native-skia/issues/new).

### Text
Currently text rendering is not supported

### CSS Styles
CSS styles included in SVG are not supported. A tool like [SVGO](https://shopify.github.io/react-native-skia/docs/images-svg/#using-svgo) can help with converting CSS style attributes to SVG attributes if possible. You can use it online [here](https://jakearchibald.github.io/svgomg/). For instance, it can normalize CSS style attributes that contain transformations to the proper ```transform``` property.

### RGBA Colors
The RGBA color syntax is not supported. Instead, it would help if you used the ```fill-opacity``` and ```stroke-opacity``` attributes. Consider the example below.

```js
<circle
  r="10"
  cx="10"
  cy="10"
  fill="rgba(100, 200, 300, 0.5)"
  stroke="rgba(100, 200, 300, 0.8)"
/>
```

Would need to be rewritten as:

```js
<circle
  r="10"
  cx="10"
  cy="10"
  fill="rgb(100, 200, 300)"
  fill-opacity="0.5"
  stroke="rgb(100, 200, 300)"
  stroke-opacity="0.8"
/>
```
The ```opacity``` attribute also applies to both the ```fill``` and ```stroke``` attributes.

### Non Supported Elements
Below is the list of non-supported element. Often these SVGs can be rewritten to not use these elements.

- ```<altGlyph>``` (deprecated)
- ```<animate>```
- ```<cursor>``` (deprecated)
- ```<feComponentTransfer>```
- ```<feConvolveMatrix>```
- ```<feTile>```
- ```<feDropShadow>```
- ```<font>``` (deprecated)
- ```<foreignObject>```
- ```<glyph>``` (deprecated)
- ```<script>```
- ```<view>```

### Font Family
When rendering your SVG with Skia, all fonts available in your app are also available to your SVG. However, the way you can set the font-family attribute is as flexible as on the web.

```js
// ✅ This is really all that is supported:
<text font-family="MyFont" />
// ❌ This won't work. If MyFont is available, this syntax will be accepted.
// but it will never fallback to monospace
<text font-family="MyFont, monospace" />
// ❌ The single quote syntax won't work either.
<text font-family="'MyFont'" />
```

### Inlined SVGs
Some SVGs contain inlined SVGs via the ```<image>``` or ```<feImage>``` elements. This is not supported.

### Gradient Templates
The deprecated ```xlink:href``` attribute is not supported in gradients. You can use the ```href``` attribute instead. However, we found that it doesn't appear to be adequately supported. We would recommend avoiding using it.

### Fallbacks
Some SVG with issues display nicely in the browser because they are very tolerant of errors. We found that the Skia SVG module is much less forgiving.

# Snapshot Views
## Creating Snapshots of Views
The function ```makeImageFromView``` lets you take a snapshot of another React Native View as a Skia ```SkImage```. The function accepts a ```ref``` to a native view and returns a promise that resolves to an ```SkImage``` instance upon success.

**info**
It is safer to use ```collapsable=false``` on the root view of the snapshot to prevent the root view from being removed by React Native. If the view is optimized away, ```makeImageFromView``` will crash or return the wrong result.

```js
import { useState, useRef } from "react";
import { View, Text, PixelRatio, StyleSheet, Pressable } from "react-native";
import type { SkImage } from "@shopify/react-native-skia";
import { makeImageFromView, Canvas, Image } from "@shopify/react-native-skia";
 
const pd = PixelRatio.get();
 
const Demo = () => {
  // Create a ref for the view you'd like to take a snapshot of
  const ref = useRef<View>(null);
  // Create a state variable to store the snapshot
  const [image, setImage] = useState<SkImage | null>(null);
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
          style={{ backgroundColor: "cyan", flex: 1 }}>
          <Text>This is a React Native View</Text>
        </View>
      </Pressable>
      {
        image && (
          <Canvas style={StyleSheet.absoluteFill}>
            <Image
              image={image}
              x={0}
              y={0}
              width={image.width() / pd}
              height={image.height() / pd}
            />
          </Canvas>
        )
      }
    </View>
  )
};
```

# Video
React Native Skia provides a way to load video frames as images, enabling rich multimedia experiences within your applications. A video frame can be used anywhere a Skia image is accepted: ```Image```, ```ImageShader```, and ```Atlas```. ```Videos``` are also supported on Web.

## Requirements
- Reanimated version 3 or higher.
- Android: API level 26 or higher.

## Example
Here is an example of how to use the video support in React Native Skia. This example demonstrates how to load and display video frames within a canvas, applying a color matrix for visual effects. Tapping the screen will pause and play the video.

The video can be a remote (```http://...```) or local URL (```file://```), as well as a [video from the bundle](https://shopify.github.io/react-native-skia/docs/video#using-assets).

```js
import React from "react";
import {
  Canvas,
  ColorMatrix,
  Fill,
  ImageShader,
  useVideo
} from "@shopify/react-native-skia";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
 
export const VideoExample = () => {
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const { currentFrame } = useVideo(
    "https://bit.ly/skia-video",
    {
      paused,
    }
  );
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => (paused.value = !paused.value)}
    >
      <Canvas style={{ flex: 1 }}>
        <Fill>
          <ImageShader
            image={currentFrame}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="cover"
          />
          <ColorMatrix
            matrix={[
              0.95, 0, 0, 0, 0.05, 0.65, 0, 0, 0, 0.15, 0.15, 0, 0, 0, 0.5, 0,
              0, 0, 1, 0,
            ]}
          />
        </Fill>
      </Canvas>
    </Pressable>
  );
};
```


## Returned Values
The ```useVideo``` hook returns ```currentFrame```, which contains the current video frame, as well as ```currentTime```, ```rotation```, and ```size```.

## Playback Options
The following table describes the playback options available for the ```useVideo``` hook:

| Option  | Description                                                                       |
| ------- | --------------------------------------------------------------------------------- |
| seek    | Allows seeking to a specific point in the video in milliseconds. Default is null. |
| paused  | Indicates whether the video is paused.                                            |
| looping | Indicates whether the video should loop.                                          |
| volume  | A value from 0 to 1 representing the volume level                                 |
|         | (0 is muted, 1 is the maximum volume).                                            |

In the example below, every time we tap on the video, we set the video seek at 2 seconds.

```js
import React from "react";
import {
  Canvas,
  Fill,
  Image,
  useVideo
} from "@shopify/react-native-skia";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
 
export const VideoExample = () => {
  const seek = useSharedValue<null | number>(null);
  // Set this value to true to pause the video
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const {currentFrame, currentTime} = useVideo(
    "https://bit.ly/skia-video",
    {
      seek,
      paused,
      looping: true
    }
  );
  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => (seek.value = 2000)}
    >
      <Canvas style={{ flex: 1 }}>
        <Image
          image={currentFrame}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
      </Canvas>
    </Pressable>
  );
};
```

## Rotated Video
The ```rotation``` property can be ```0```, ```90```, ```180```, or ```270```. We provide a ```fitbox``` function that can help with rotating and scaling the video.

```js
import React from "react";
import {
  Canvas,
  Image,
  useVideo,
  fitbox,
  rect
} from "@shopify/react-native-skia";
import { Pressable, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
 
export const VideoExample = () => {
  const paused = useSharedValue(false);
  const { width, height } = useWindowDimensions();
  const { currentFrame, rotation, size } = useVideo("https://bit.ly/skia-video");
  const src = rect(0, 0, size.width, size.height);
  const dst = rect(0, 0, width, height)
  const transform = fitbox("cover", src, dst, rotation);
  return (
    <Canvas style={{ flex: 1 }}>
      <Image
        image={currentFrame}
        x={0}
        y={0}
        width={width}
        height={height}
        fit="none"
        transform={transform}
      />
    </Canvas>
  );
};
```

## Using Assets
Below is an example where we use [expo-asset](https://docs.expo.dev/versions/latest/sdk/asset/) to load a video file from the bundle.

```js
import { useVideo } from "@shopify/react-native-skia";
import { useAssets } from "expo-asset";
 
// Example usage:
// const video = useVideoFromAsset(require("./BigBuckBunny.mp4"));
export const useVideoFromAsset = (
  mod: number,
  options?: Parameters<typeof useVideo>[1]
) => {
  const [assets, error] = useAssets([mod]);
  if (error) {
    throw error;
  }
  return useVideo(assets ? assets[0].localUri : null, options);
};
```

## Video Encoding
To encode videos from Skia images, you can use ffmpeg or also look into [react-native-skia-video](https://github.com/AzzappApp/react-native-skia-video).

# Text
## Paragraph
React Native Skia offers an API to perform text layouts using the Skia Paragraph API.

### Hello World
In the example below, we create a simple paragraph based on custom fonts. The emojis will be renderer using the emoji font available on the platform. Other system fonts will are available as well.

```js
import { useMemo } from "react";
import { Paragraph, Skia, useFonts, TextAlign, Canvas } from "@shopify/react-native-skia";
 
const MyParagraph = () => {
  const customFontMgr = useFonts({
    Roboto: [
      require("path/to/Roboto-Regular.ttf"),
      require("path/to/Roboto-Medium.ttf")
    ]
  });
 
  const paragraph = useMemo(() => {
    // Are the font loaded already?
    if (!customFontMgr) {
      return null;
    }
    const paragraphStyle = {
      textAlign: TextAlign.Center
    };
    const textStyle = {
      color: Skia.Color("black"),
      fontFamilies: ["Roboto"],
      fontSize: 50,
    };
    return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
      .pushStyle(textStyle)
      .addText("Say Hello to ")
      .pushStyle({ ...textStyle, fontStyle: { weight: 500 } })
      .addText("Skia 🎨")
      .pop()
      .build();
  }, [customFontMgr]);
 
  // Render the paragraph
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Paragraph paragraph={paragraph} x={0} y={0} width={300} />
    </Canvas>
  );
};
```

On Web, you will need to provide you own emoji font ([NotoColorEmoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji) for instance) and add it to the list of font families.

```js
import { useFonts, Skia } from "@shopify/react-native-skia";
 
const customFontMgr = useFonts({
  Roboto: [
    require("path/to/Roboto-Regular.ttf"),
    require("path/to/Roboto-Medium.ttf")
  ],
  // Only load the emoji font on Web
  Noto: [
    require("path/to/NotoColorEmoji.ttf")
  ]
});
 
// We add Noto to the list of font families
const textStyle = {
  color: Skia.Color("black"),
  fontFamilies: ["Roboto", "Noto"],
  fontSize: 50,
};
```

### Using Paints
You can use paint objects for the foreground and the background of a text style. 

https://www.tweag.io/blog/2024-07-04-image-transition-react-native-skia/

Head over to the [GL Transition gallery](https://gl-transitions.com/gallery) to select an effect. e.g. use the "DirectionalWarp" effect. We have to convert the ```GLSL``` code for our chosen effect to ```SKSL``` using ```Skia.RuntimeEffect.Make```.

Below we use a foreground and a background paint on a text style:

```js
import { useMemo } from "react";
import { Paragraph, Skia, useFonts, Canvas, Rect, TileMode } from "@shopify/react-native-skia";
 
// Our background shader
const source = Skia.RuntimeEffect.Make(`
uniform vec4 position;
uniform vec4 colors[4];
 
vec4 main(vec2 pos) {
  vec2 uv = (pos - vec2(position.x, position.y))/vec2(position.z, position.w);
  vec4 colorA = mix(colors[0], colors[1], uv.x);
  vec4 colorB = mix(colors[2], colors[3], uv.x);
  return mix(colorA, colorB, uv.y);
}`)!;
 
// Define an array of colors for the gradient to be used in shader uniform
const colors = [
  // #dafb61
  0.85, 0.98, 0.38, 1.0,
  // #61dafb
  0.38, 0.85, 0.98, 1.0,
  // #fb61da
  0.98, 0.38, 0.85, 1.0,
  // #61fbcf
  0.38, 0.98, 0.81, 1.0
];
 
const MyParagraph = () => {
  const paragraph = useMemo(() => {
 
    // Create a background paint.
    const backgroundPaint = Skia.Paint();
    backgroundPaint.setShader(
      source.makeShader([0, 0, 256, 256, ...colors])
    );
 
    // Create a foreground paint. We use a radial gradient.
    const foregroundPaint = Skia.Paint();
    foregroundPaint.setShader(
      Skia.Shader.MakeRadialGradient(
        { x: 0, y: 0 },
        256,
        [Skia.Color("magenta"), Skia.Color("yellow")],
        null,
        TileMode.Clamp
      )
    );
 
    const para = Skia.ParagraphBuilder.Make()
     .pushStyle(
        {
          fontFamilies: ["Roboto"],
          fontSize: 72,
          fontStyle: { weight: 500 },
          color: Skia.Color("black"),
        },
        foregroundPaint,
        backgroundPaint
      )
      .addText("Say Hello to React Native Skia")
      .pop()
      .build();
    return para;
  }, []);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Paragraph paragraph={paragraph} x={0} y={0} width={256} />
    </Canvas>
  );
};
```

### Applying Effects
The ```Paragraph``` component doesn't follow the same painting rules as other components. However you can apply effets using the ```layer``` property. For instance, in the example below, fopr we apply a blur image filter.

```js
import React from "react";
import { Canvas, Skia, Group, Paint, Blur, Paragraph } from "@shopify/react-native-skia";
 
const width = 256;
const height = 256;
 
export const Demo = () => {
  const paragraph = Skia.ParagraphBuilder.Make()
          .pushStyle({
            color: Skia.Color("black"),
            fontSize: 25,
          })
          .addText("Hello Skia")
          .build();
  return (
    <Canvas style={{ flex: 1 }}>
      <Group layer={<Paint><Blur blur={10} /></Paint>}>
        <Paragraph paragraph={paragraph} x={0} y={0} width={width} />
      </Group>
    </Canvas>
  );
};
```

### Paragraph Bounding Box
Before getting the paragraph height and width, you need to compute its layout using ```layout()``` and once done, you can invoke ```getHeight()``` for the height and ```getLongestLine()``` for the width.

```js
import { useMemo } from "react";
import { Paragraph, Skia, useFonts, Canvas, Rect } from "@shopify/react-native-skia";
 
const MyParagraph = () => {
  const paragraph = useMemo(() => {
    const para = Skia.ParagraphBuilder.Make()
      .addText("Say Hello to React Native Skia")
      .build();
    // Calculate the layout
    para.layout(200);
    return para;
  }, []);
  // Now the paragraph height is available
  const height = paragraph.getHeight();
  const width = paragraph.getLongestLine();
  // Render the paragraph
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      {/* Maximum paragraph width */}
      <Rect x={0} y={0} width={200} height={256} color="magenta" />
      {/* Paragraph bounding box */}
      <Rect x={0} y={0} width={width} height={height} color="cyan" />
      <Paragraph paragraph={paragraph} x={0} y={0} width={200} />
    </Canvas>
  );
};
```

### Fonts
By default, the paragraph API will use the system fonts. You can also use custom fonts with this API was well.

The ```useFonts``` hooks allows you to load custom fonts to be used for your Skia drawing. The font files should be organized by family names. For example:

```js
import {useFonts} from "@shopify/react-native-skia";
 
const fontMgr = useFonts({
  Roboto: [
    require("./Roboto-Medium.ttf"),
    require("./Roboto-Regular.ttf"),
    require("./Roboto-Bold.ttf"),
  ],
  Helvetica: [require("./Helvetica.ttf")],
});
if (!fontMgr) {
  // Returns null until all fonts are loaded
}
// Now the fonts are available
```

You can also list the available system fonts via ```listFontFamilies()``` function.

### Styling Paragraphs
These properties define the overall layout and behavior of a paragraph.

| Property             | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| disableHinting       | Controls whether text hinting is disabled.                             |
| ellipsis             | Specifies the text to use for ellipsis when text overflows.            |
| heightMultiplier     | Sets the line height as a multiplier of the font size.                 |
| maxLines             | Maximum number of lines for the paragraph.                             |
| replaceTabCharacters | Determines whether tab characters should be replaced with spaces.      |
| strutStyle           | Defines the strut style, which affects the minimum height of a line.   |
| textAlign            | Sets the alignment of text (left, right, center, justify, start, end). |
| textDirection        | Determines the text direction (RTL or LTR).                            |
| textHeightBehavior   | Controls the behavior of text ascent and descent                       |
|                      | in the first and last lines.                                           |
| textStyle            | Default text style for the paragraph (can be overridden by             |
|                      | individual text styles).                                               |

Below is an example to center text with textAlign property:
```js
import { useMemo } from "react";
import { Paragraph, Skia, TextAlign, Canvas, Rect } from "@shopify/react-native-skia";
 
const MyParagraph = () => {
  const paragraph = useMemo(() => {
    const para = Skia.ParagraphBuilder.Make({
          textAlign: TextAlign.Center,
      })
      .addText("Say Hello to React Native Skia")
      .build();
    return para;
  }, []);
 
  // Render the paragraph with the text center
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Paragraph paragraph={paragraph} x={0} y={0} width={200} />
    </Canvas>
  );
};
```

### Text Style Properties
These properties are used to style specific segments of text within a paragraph.

| Property            | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| backgroundColor     | Background color of the text.                                       |
| color               | Color of the text.                                                  |
| decoration          | Type of text decoration (underline, overline, line-through).        |
| decorationColor     | Color of the text decoration.                                       |
| decorationThickness | Thickness of the text decoration.                                   |
| decorationStyle     | Style of the text decoration (solid, double, dotted, dashed, wavy). |
| fontFamilies        | List of font families for the text.                                 |
| fontFeatures        | List of font features.                                              |
| fontSize            | Font size of the text.                                              |
| fontStyle           | Font style (weight, width, slant).                                  |
| fontVariations      | Font variations.                                                    |
| foregroundColor     | Foreground color (for effects like gradients).                      |
| heightMultiplier    | Multiplier for line height.                                         |
| halfLeading         | Controls half-leading value.                                        |
| letterSpacing       | Space between characters.                                           |
| locale              | Locale for the text (affects things like sorting).                  |
| shadows             | List of text shadows.                                               |
| textBaseline        | Baseline for the text (alphabetic, ideographic).                    |
| wordSpacing         | Space between words.                                                |

These tables offer a quick reference to differentiate between paragraph and text styles in React Native Skia. You can use them to guide developers on how to apply various styles to create visually appealing and functional text layouts. Below is an example using different font styling:

```js
import { useMemo } from "react";
import { Paragraph, Skia, useFonts, FontStyle } from "@shopify/react-native-skia";
 
const MyParagraph = () => {
  const customFontMgr = useFonts({
    Roboto: [
        require("path/to/Roboto-Italic.ttf"),
        require("path/to/Roboto-Regular.ttf"),
        require("path/to/Roboto-Bold.ttf")
    ],
  });
 
  const paragraph = useMemo(() => {
    // Are the custom fonts loaded?
    if (!customFontMgr) {
      return null;
    }
    const textStyle = {
      fontSize: 24,
      fontFamilies: ["Roboto"],
      color: Skia.Color("#000"),
    };
 
    const paragraphBuilder = Skia.ParagraphBuilder.Make({}, customFontMgr);
    paragraphBuilder
      .pushStyle({ ...textStyle, fontStyle: FontStyle.Bold })
      .addText("This text is bold\n")
      .pop()
      .pushStyle({ ...textStyle, fontStyle: FontStyle.Normal })
      .addText("This text is regular\n")
      .pop()
      .pushStyle({ ...textStyle, fontStyle: FontStyle.Italic })
      .addText("This text is italic")
      .pop()
      .build();
    return paragraphBuilder.build();
  }, [customFontMgr]);
 
  return <Paragraph paragraph={paragraph} x={0} y={0} width={300} />;
};
```

## Text
The text component can be used to draw a simple text. Please note that the y origin of the Text is the bottom of the text, not the top.

| Name | Type   | Description                                   |
| ---- | ------ | --------------------------------------------- |
| text | string | Text to draw                                  |
| font | SkFont | Font to use                                   |
| x    | number | Left position of the text (default is 0)      |
| y    | number | Bottom position the text (default is 0, the ) |

### Simple Text
```js
import {Canvas, Text, useFont, Fill} from "@shopify/react-native-skia";
 
export const HelloWorld = () => {
  const fontSize = 32;
  const font = useFont(require("./my-font.ttf"), fontSize);
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="white" />
      <Text
        x={0}
        y={fontSize}
        text="Hello World"
        font={font}
      />
    </Canvas>
  );
};
```

### Fonts
Once the fonts are loaded, we provide a ```matchFont``` function that given a font style will return a font object that you can use directly.

**info**
For font matching we recommend using the [Paragraph API](https://shopify.github.io/react-native-skia/docs/text/paragraph/) instead. The APIs belows were made available before the Paragraph API was released.

```js
import {useFonts, Text, matchFont} from "@shopify/react-native-skia";
 
const Demo = () => {
  const fontMgr = useFonts({
    Roboto: [
      require("./Roboto-Medium.ttf"),
      require("./Roboto-Regular.ttf"),
      require("./Roboto-Bold.ttf"),
    ]
  });
  if (!fontMgr) {
    return null;
  }
  const fontStyle = {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16
  } as const;
  const font = matchFont(fontStyle, fontMgr);
  return (
    <Text text="Hello World" y={32} x={32} font={font} />
  );
};
```

### System Fonts
System fonts are available via ```Skia.FontMgr.System()```. You can list system fonts via ```listFontFamilies``` function returns the list of available system font families. By default the function will list system fonts but you can pass an optional ```fontMgr``` object as parameter.

```js
import {listFontFamilies} from "@shopify/react-native-skia";
 
console.log(listFontFamilies());
```

By default ```matchFont```, will match fonts from the system font manager:
```js
import {Platform} from "react-native";
import {Canvas, Text, matchFont, Fill, Skia} from "@shopify/react-native-skia";
 
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontStyle: "italic",
  fontWeight: "bold",
};
const font = matchFont(fontStyle);
 
export const HelloWorld = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="white" />
      <Text
        x={0}
        y={fontStyle.fontSize}
        text="Hello World"
        font={font}
      />
    </Canvas>
  );
};
```

The ```fontStyle``` object can have the following list of optional attributes:
- ```fontFamily```: The name of the font family.
- ```fontSize```: The size of the font.
- ```fontStyle```: The slant of the font. Can be normal, italic, or oblique.
- ```fontWeight```: The weight of the font. Can be normal, bold, or any of 100, 200, 300, 400, 500, 600, 700, 800, 900.

By default, ```matchFont``` uses the system font manager to match the font style. However, if you want to use your custom font manager, you can pass it as the second parameter to the ```matchFont``` function:

```js
import {matchFont, useFonts} from "@shopify/react-native-skia";
 
const fontMgr = useFonts({
  Roboto: [
    require("../../Tests/assets/Roboto-Medium.ttf"),
    require("../../Tests/assets/Roboto-Bold.ttf"),
  ]
});
 
const font = matchFont(fontStyle, fontMgr);
```

### Low-level API
The basic usage of the system font manager is as follows. These are the APIs used behind the scene by the ```matchFont``` function.
```js
import {Platform} from "react-native";
import {Skia, FontStyle} from "@shopify/react-native-skia";
 
const familyName = Platform.select({ ios: "Helvetica", default: "serif" });
const fontSize = 32;
// Get the system font manager
const fontMgr = Skia.FontMgr.System();
// The custom font manager is available via Skia.TypefaceFontProvider.Make()
const customFontMgr = Skia.TypefaceFontProvider.Make();
// typeface needs to be loaded via Skia.Data and instanciated via
// Skia.Typeface.MakeFreeTypeFaceFromData()
// customFontMgr.registerTypeface(customTypeFace, "Roboto");
 
// Matching a font
const typeface =  fontMgr.matchFamilyStyle(familyName, FontStyle.Bold);
const font = Skia.Font(typeface, fontSize);
```

## Glyphs
This component draws a run of glyphs, at corresponding positions, in a given font.

| Name   | Type    | Description                                                |
| ------ | ------- | ---------------------------------------------------------- |
| glyphs | Glyph[] | Glyphs to draw                                             |
| x?     | number. | x coordinate of the origin of the entire run. Default is 0 |
| y?     | number. | y coordinate of the origin of the entire run. Default is 0 |
| font   | SkFont  | Font to use                                                |

### Draw text vertically
```js
import {Canvas, Glyphs, vec, useFont} from "@shopify/react-native-skia";
 
export const HelloWorld = () => {
  const fontSize = 32;
  const font = useFont(require("./my-font.otf"), fontSize);
  if (font === null) {
    return null;
  }
  const glyphs = font
    .getGlyphIDs("Hello World!")
    .map((id, i) => ({ id, pos: vec(0, (i + 1) * fontSize) }));
  return (
    <Canvas style={{ flex:  1 }}>
      <Glyphs
        font={font}
        glyphs={glyphs}
      />
    </Canvas>
  );
}
```

## Text Path
Draws text along a path.

| Name | Type           | Description                                                  |
| ---- | -------------- | ------------------------------------------------------------ |
| path | Path or string | Path to draw. Can be a string using the                      |
|      |                | SVG Path notation or an object created with Skia.Path.Make() |
| text | string         | Text to draw                                                 |
| font | SkFont         | Font to use                                                  |

[SVG Path Notation](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#line_commands)

### Example
```js
import {Canvas, Group, TextPath, Skia, useFont, vec, Fill} from "@shopify/react-native-skia";
 
const size = 128;
const path = Skia.Path.Make();
path.addCircle(size, size, size/2);
 
export const HelloWorld = () => {
  const font = useFont(require("./my-font.ttf"), 24);
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="white" />
      <Group transform={[{ rotate: Math.PI }]} origin={vec(size, size)}>
        <TextPath font={font} path={path} text="Hello World!" />
      </Group>
    </Canvas>
  );
};
```

## Text Blob
A text blob contains glyphs, positions, and paint attributes specific to the text.

| Name | Type     | Description                                                |
| ---- | -------- | ---------------------------------------------------------- |
| blob | TextBlob | Text blob                                                  |
| x?   | number   | x coordinate of the origin of the entire run. Default is 0 |
| y?   | number   | y coordinate of the origin of the entire run. Default is 0 |

### Example
```js
import {Canvas, TextBlob, Skia, useFont} from "@shopify/react-native-skia";

export const HelloWorld = () => {
  const font = useFont(require("./SF-Pro.ttf"), 24);
  if (font === null) {
    return null;
  }
  const blob = Skia.TextBlob.MakeFromText("Hello World!", font);
  return (
      <Canvas style={{ flex: 1 }}>
        <TextBlob
          blob={blob}
          color="blue"
        />
      </Canvas>
  );
};
```

# Shaders
## Shading Language
Skia provides a shading language. You can play with it [here](https://shaders.skia.org/). The syntax is very similar to GLSL. If you're already familiar with GLSL, or are looking to convert a GLSL shader to SKSL, you can view a list of their differences [here](https://github.com/google/skia/tree/main/src/sksl#readme).

The first step is to create a shader and compile it using ```RuntimeEffect.Make```.

```js
import {Skia} from "@shopify/react-native-skia";
 
const source = Skia.RuntimeEffect.Make(`
vec4 main(vec2 pos) {
  // The canvas is 256x256
  vec2 canvas = vec2(256);
  // normalized x,y values go from 0 to 1
  vec2 normalized = pos/canvas;
  return vec4(normalized.x, normalized.y, 0.5, 1);
}`);
 
if (!source) {
  throw new Error("Couldn't compile the shader")
}
```

### Shader
Creates a shader from source. Shaders can be nested with one another.

| Name     | Type                        | Description                   |
| -------- | --------------------------- | ----------------------------- |
| source   | RuntimeEffect               | Compiled shaders              |
| uniforms | ```{ [name: string]: number | Vector                        | Vector[] | number[] | number[][] }``` | uniform values |
| children | Shader                      | Shaders to be used as uniform |

### Simple Shader
```js
import {Skia, Canvas, Shader, Fill} from "@shopify/react-native-skia";
 
const source = Skia.RuntimeEffect.Make(`
vec4 main(vec2 pos) {
  // normalized x,y values go from 0 to 1, the canvas is 256x256
  vec2 normalized = pos/vec2(256);
  return vec4(normalized.x, normalized.y, 0.5, 1);
}`)!;
 
const SimpleShader = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill>
        <Shader source={source} />
      </Fill>
    </Canvas>
  );
};
```

### Using Uniforms
Uniforms are variables used to parametrize shaders. The following uniform types are supported: ```float```, ```float2```, ```float3```, ```float4```, ```float2x2```, ```float3x3```, ```float4x4```, ```int```, ```int2```, ```int3``` and, ```int4```. The types can also be used as arrays, e.g. ```uniform float3 colors[12]```.

```js
import {Canvas, Skia, Shader, Fill, vec} from "@shopify/react-native-skia";
 
const source = Skia.RuntimeEffect.Make(`
uniform vec2 c;
uniform float r;
uniform float blue;
 
vec4 main(vec2 pos) {
  vec2 normalized = pos/vec2(2 * r);
  return distance(pos, c) > r ? vec4(1) : vec4(normalized, blue, 1);
}`)!;
 
const UniformShader = () => {
  const r = 128;
  const c = vec(2 * r, r);
  const blue = 1.0;
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill>
        <Shader source={source} uniforms={{ c, r, blue }} />
      </Fill>
    </Canvas>
  );
};
```

### Nested Shaders
```js
import {Canvas, Skia, ImageShader, Shader, Fill, useImage} from "@shopify/react-native-skia";
 
const source = Skia.RuntimeEffect.Make(`
uniform shader image;
 
half4 main(float2 xy) {   
  xy.x += sin(xy.y / 3) * 4;
  return image.eval(xy).rbga;
}`)!;
 
const NestedShader = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill>
        <Shader source={source}>
          <ImageShader
            image={image}
            fit="cover"
            rect={{ x: 0, y: 0, width: 256, height: 256 }}
          />
        </Shader>
      </Fill>
    </Canvas>
  );
};
```

## Image Shaders
### Image
Returns an image as a shader with the specified tiling. It will use cubic sampling.

| Name       | Type         | Description                                                  |
| ---------- | ------------ | ------------------------------------------------------------ |
| image      | SkImage      | Image instance.                                              |
| tx?        | TileMode     | Can be clamp, repeat, mirror, or decal.                      |
| ty?        | TileMode     | Can be clamp, repeat, mirror, or decal.                      |
| fit?       | Fit          | Calculate the transformation matrix to fit                   |
|            |              | the rectangle defined by fitRect. See images.                |
| rect?      | SkRect       | The destination rectangle to calculate the                   |
|            |              | transformation matrix via the fit property.                  |
| transform? | Transforms2d | see transformations.                                         |
| sampling?  | Sampling     | The method used to sample the image. see (sampling options). |

### Example
```js
import {
  Canvas,
  Circle,
  ImageShader,
  Skia,
  Shader,
  useImage
} from "@shopify/react-native-skia";
 
const ImageShaderDemo = () => {
  const image = useImage(require("../../assets/oslo.jpg"));
  if (image === null) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      <Circle cx={128} cy={128} r={128}>
        <ImageShader
          image={image}
          fit="cover"
          rect={{ x: 0, y: 0, width: 256, height: 256 }}
        />
      </Circle>
    </Canvas>
  );
};
```

## Gradients
### Common Properties
Below are the properties common to all gradient components.

| Name       | Type         | Description                                                       |
| ---------- | ------------ | ----------------------------------------------------------------- |
| colors     | string[]     | Colors to be distributed between start and end.                   |
| positions? | number[]     | The relative positions of colors. If supplied, it                 |
|            |              | must be of the same length as colors.                             |
| mode?      | TileMode     | Can be clamp, repeat, mirror, or decal.                           |
| flags?     | number       | By default, gradients will interpolate their colors in            |
|            |              | unpremultiplied space and then premultiply each of the results.   |
|            |              | By setting this to 1, the gradients will premultiply their colors |
|            |              | first and then interpolate between them.                          |
| transform? | Transforms2d | see transformations.                                              |

### Linear Gradient
Returns a shader that generates a linear gradient between the two specified points.

| Name  | Type  | Description                     |
| ----- | ----- | ------------------------------- |
| start | Point | Start position of the gradient. |
| end   | Point | End position of the gradient.   |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  LinearGradient,
  Skia,
  Shader,
  vec
} from "@shopify/react-native-skia";
 
export const LinearGradientDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(256, 256)}
          colors={["blue", "yellow"]}
        />
      </Rect>
    </Canvas>
  );
};
```

### Radial Gradient
Returns a shader that generates a radial gradient given the center and radius.

| Name | Type   | Description             |
| ---- | ------ | ----------------------- |
| c    | Point  | Center of the gradient. |
| r    | number | Radius of the gradient. |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  RadialGradient,
  Skia,
  Shader,
  vec
} from "@shopify/react-native-skia";
 
export const RadialGradientDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <RadialGradient
          c={vec(128, 128)}
          r={128}
          colors={["blue", "yellow"]}
        />
      </Rect>
    </Canvas>
  );
};
```

### Two Point Conical Gradient
Returns a shader that generates a conical gradient given two circles.

| Name   | Type   | Description                 |
| ------ | ------ | --------------------------- |
| start  | Point  | Center of the start circle. |
| startR | number | Radius of the start circle. |
| end    | number | Center of the end circle.   |
| endR   | number | Radius of the end circle.   |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  TwoPointConicalGradient,
  Skia,
  Shader,
  vec
} from "@shopify/react-native-skia";
 
export const TwoPointConicalGradientDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <TwoPointConicalGradient
          start={vec(128, 128)}
          startR={128}
          end={vec(128, 16)}
          endR={16}
          colors={["blue", "yellow"]}
        />
      </Rect>
    </Canvas>
  );
};
```

### Sweep Gradient
Returns a shader that generates a sweep gradient given a center.

| Name   | Type   | Description                            |
| ------ | ------ | -------------------------------------- |
| c      | Point  | Center of the gradient                 |
| start? | number | Start angle in degrees (default is 0). |
| end?   | number | End angle in degrees (default is 360). |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  SweepGradient,
  Skia,
  Shader,
  vec
} from "@shopify/react-native-skia";
 
export const SweepGradientDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <SweepGradient
          c={vec(128, 128)}
          colors={["cyan", "magenta", "yellow", "cyan"]}
        />
      </Rect>
    </Canvas>
  );
};
```

## Perlin Noise Shaders
### Fractal Perlin Noise Shader
Returns a shader with Perlin Fractal Noise.

| Name        | Type   | Description                                                             |
| ----------- | ------ | ----------------------------------------------------------------------- |
| freqX       | number | base frequency in the X direction; range [0.0, 1.0]                     |
| freqY       | number | base frequency in the Y direction; range [0.0, 1.0]                     |
| octaves     | number |                                                                         |
| seed        | number |                                                                         |
| tileWidth?  | number | if this and tileHeight are non-zero, the frequencies                    |
|             |        | will be modified so that the noise will be tileable for the given size. |
| tileHeight? | number | if this and tileWidth are non-zero, the frequencies                     |
|             |        | will be modified so that the noise will be tileable for the given size. |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  FractalNoise,
  Skia,
  Shader,
  Fill,
  vec
} from "@shopify/react-native-skia";
 
export const FractalNoiseDemo = () => {
  return (
    <Canvas style={{ width:256, height:256 }}>
      <Fill color="white" />
      <Rect x={0} y={0} width={256} height={256}>
        <FractalNoise freqX={0.05} freqY={0.05} octaves={4} />
      </Rect>
    </Canvas>
  );
};
```

### Turbulence Perlin Noise Shader
Returns a shader with ```Perlin Turbulence```.

| Name        | Type   | Description                                                             |
| ----------- | ------ | ----------------------------------------------------------------------- |
| freqX       | number | base frequency in the X direction; range [0.0, 1.0]                     |
| freqY       | number | base frequency in the Y direction; range [0.0, 1.0]                     |
| octaves     | number |                                                                         |
| seed        | number |                                                                         |
| tileWidth?  | number | if this and tileHeight are non-zero, the frequencies                    |
|             |        | will be modified so that the noise will be tileable for the given size. |
| tileHeight? | number | if this and tileWidth are non-zero, the frequencies will                |
|             |        | be modified so that the noise will be tileable for the given size.      |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  Turbulence,
  Skia,
  Shader,
  Fill,
  vec
} from "@shopify/react-native-skia";
 
export const TurbulenceDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="white" />
      <Rect x={0} y={0} width={256} height={256}>
        <Turbulence freqX={0.05} freqY={0.05} octaves={4} />
      </Rect>
    </Canvas>
  );
};
```

## Blending and Colors
### Blend Shader
Returns a shader that combines the given shaders with a BlendMode.

| Name     | Type      | Description      |
| -------- | --------- | ---------------- |
| mode     | BlendMode | see blend modes. |
| children | ReactNode | Shaders to blend |

#### Example
```js
import React from "react";
import {
  Canvas,
  Rect,
  Turbulence,
  Skia,
  Shader,
  Fill,
  RadialGradient,
  Blend,
  vec
} from "@shopify/react-native-skia";
 
export const BlendDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={256} height={256}>
        <Blend mode="difference">
          <RadialGradient
            r={128}
            c={vec(128, 128)}
            colors={["blue", "yellow"]}
          />
          <Turbulence freqX={0.05} freqY={0.05} octaves={4} />
        </Blend>
      </Rect>
    </Canvas>
  );
};
```

### Color Shader
Returns a shader with a given color.

| Name  | Type   | Description |
| ----- | ------ | ----------- |
| color | string | Color       |

#### Example
```js
import React from "react";
import {
  Canvas,
  Skia,
  Fill,
  ColorShader
} from "@shopify/react-native-skia";
 
export const BlendDemo = () => {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill>
        <ColorShader color="lightBlue" />
      </Fill>
    </Canvas>
  );
};
```

# Image Filters
Image filters are effects that operate on all the color bits of pixels that make up an image.

## Composing Filters
```Color Filters``` and ```Shaders``` can also be used as ```Image filters```. In the example below, we first apply a color matrix to the content and a blur image filter.

```js
import { Canvas, Blur, Image, ColorMatrix, useImage } from "@shopify/react-native-skia";
 
const ComposeImageFilter = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      <Image
        x={0}
        y={0}
        width={256}
        height={256}
        image={image}
        fit="cover"
      >
        <Blur blur={2} mode="clamp">
          <ColorMatrix
            matrix={[
              -0.578, 0.99, 0.588, 0, 0, 0.469, 0.535, -0.003, 0, 0, 0.015,
              1.69, -0.703, 0, 0, 0, 0, 0, 1, 0,
            ]}
          />
        </Blur>
      </Image>
    </Canvas>
  );
};
```

## Shadows
The ```DropShadow``` image filter is equivalent to its [SVG counterpart](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow()). It creates a filter that draws a drop shadow under the input content. A ```shadowOnly``` property renders the drop shadow, excluding the input content. It can also render an inner shadow via the ```inner``` property.

If you want to render inner shadows to a rounded rectangle, [box shadows](https://shopify.github.io/react-native-skia/docs/shapes/box) are much faster.

| Name        | Type        | Description                                            |
| ----------- | ----------- | ------------------------------------------------------ |
| dx          | number      | The X offset of the shadow.                            |
| dy          | number      | The Y offset of the shadow.                            |
| blur        | number      | The blur radius for the shadow                         |
| color       | Color       | The color of the drop shadow                           |
| inner?      | boolean     | Shadows are drawn within the input content             |
| shadowOnly? | boolean     | If true, the result does not include the input content |
| children?   | ImageFilter | Optional image filter to be applied first              |

### Drop Shadow
The example below creates two drop shadows. It is equivalent to the following CSS notation.
```css
.paint {
  filter: drop-shadow(12px 12px 25px #93b8c4) drop-shadow(-12px -12px 25px #c7f8ff);
}
```

```js
import {
  Shadow,
  Fill,
  RoundedRect,
  Canvas
} from "@shopify/react-native-skia";
 
const Neumorphism = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <RoundedRect x={32} y={32} width={192} height={192} r={32} color="lightblue">
        <Shadow dx={12} dy={12} blur={25} color="#93b8c4" />
        <Shadow dx={-12} dy={-12} blur={25} color="#c7f8ff" />
      </RoundedRect>
    </Canvas>
  );
};
```

### Inner Shadow
```js
import {
  Shadow,
  Fill,
  RoundedRect,
  Canvas
} from "@shopify/react-native-skia";
 
const Neumorphism = () => {
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <RoundedRect x={32} y={32} width={192} height={192} r={32} color="lightblue">
        <Shadow dx={12} dy={12} blur={25} color="#93b8c4" inner />
        <Shadow dx={-12} dy={-12} blur={25} color="#c7f8ff" inner />
      </RoundedRect>
    </Canvas>
  );
};
```

## Blur
Creates an image filter that blurs its input by the separate X and Y sigmas. The provided tile mode is used when the blur kernel goes outside the input image.

| Name      | Type             | Description                                         |
| --------- | ---------------- | --------------------------------------------------- |
| blur      | number or Vector | The Gaussian sigma blur value                       |
| mode?     | TileMode         | mirror, repeat, clamp, or decal (default is decal). |
| children? | ImageFilter      | Optional image filter to be applied first.          |

### Simple Blur
```js
import { Canvas, Blur, Image, useImage } from "@shopify/react-native-skia";
 
const BlurImageFilter = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      <Image
        x={0}
        y={0}
        width={256}
        height={256}
        image={image}
        fit="cover"
      >
        <Blur blur={4} />
      </Image>
    </Canvas>
  );
};
```

## Displacement Map
The displacement map image filter is identical to its [SVG counterpart](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap). The pixel values from the child image are used to displace the filtered image spatially. The formula for the transformation looks like this:
```
P'(x,y) ← P( x + scale * (XC(x,y) - 0.5), y + scale * (YC(x,y) - 0.5))
```

where ```P(x,y)``` is the child image, and ```P'(x,y)``` is the destination. ```XC(x,y)``` and ```YC(x,y)``` are the component values of the channel designated by ```channelX``` and ```channelY```.

| Name      | Type         | Description                                |
| --------- | ------------ | ------------------------------------------ |
| channelX  | ColorChannel | Color channel to be used along the X axis. |
|           |              | Possible values are r, g, b, or a          |
| channelY  | ColorChannel | Color channel to be used along the Y axis. |
|           |              | Possible values are r, g, b, or a          |
| scale     | number       | Displacement scale factor to be used       |
| children? | ImageFilter  | Optional image filter to be applied first. |

### Example
We use a [Perlin Noise](https://shopify.github.io/react-native-skia/docs/shaders/perlin-noise) as a displacement map in the example below.

```js
import { Canvas, Image, Turbulence, DisplacementMap, useImage } from "@shopify/react-native-skia";
 
const Filter = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image
        image={image}
        x={0}
        y={0}
        width={256}
        height={256}
        fit="cover"
      >
        <DisplacementMap channelX="g" channelY="a" scale={20}>
          <Turbulence freqX={0.01} freqY={0.05} octaves={2} seed={2} />
        </DisplacementMap>
      </Image>
    </Canvas>
  );
};
```

## Offset
This offset filter is identical to its [SVG counterpart](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feOffset). It allows offsetting the filtered image.

| Name      | Type        | Description                                |
| --------- | ----------- | ------------------------------------------ |
| x         | number      | Offset along the X axis.                   |
| y         | number      | Offset along the Y axis.                   |
| children? | ImageFilter | Optional image filter to be applied first. |

### Example
```js
import { Canvas, Image, Offset, useImage, Fill } from "@shopify/react-native-skia";
 
const Filter = () => {
  const image = useImage(require("./assets/oslo.jpg"));
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Fill color="lightblue" />
      <Image
        image={image}
        x={0}
        y={0}
        width={256}
        height={256}
        fit="cover"
      >
        <Offset x={64} y={64} />
      </Image>
    </Canvas>
  );
};
```

## Morphology
The morphology image filter is identical to its [SVG counterpart](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMorphology). It is used to erode or dilate the input image. Its usefulness lies primarily in fattening or thinning effects.

| Name      | Type             | Description                                       |
| --------- | ---------------- | ------------------------------------------------- |
| operator  | erode or dilate  | whether to erode (i.e., thin) or dilate (fatten). |
|           |                  | Default is dilate                                 |
| radius    | number or Vector | Radius of the effect.                             |
| children? | ImageFilter      | Optional image filter to be applied first.        |

### Example
```js
import {Canvas, Text, Morphology, useFont} from "@shopify/react-native-skia";
 
export const MorphologyDemo = () => {
  const font = useFont(require("./SF-Pro.ttf"), 24);
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Text
        text="Hello World"
        x={32}
        y={32}
        font={font}
      />
      <Text
        text="Hello World"
        x={32}
        y={64}
        font={font}
      >
        <Morphology radius={1} />
      </Text>
      <Text
        text="Hello World"
        x={32}
        y={96}
        font={font}
      >
        <Morphology radius={0.3} operator="erode" />
      </Text>
    </Canvas>
  );
};
```

## Runtime Shader
The ```RuntimeShader``` image filter allows you to write your own [Skia Shader](https://shopify.github.io/react-native-skia/docs/shaders/overview) as an image filter. This component receives the currently filtered image as a shader uniform (or the implicit source image if no children are provided).

**info**
Because ```RuntimeShader``` doesn't take into account the pixel density scaling, we recommend applying a technique known as ```supersampling```. See [below](https://shopify.github.io/react-native-skia/docs/image-filters/runtime-shader#pixel-density).

| Name      | Type            | Description                               |
| --------- | --------------- | ----------------------------------------- |
| source    | SkRuntimeEffect | Shader to use as an image filter          |
| children? | ImageFilter     | Optional image filter to be applied first |

### Example
The example below generates a circle with a green mint color. The circle is first drawn with the light blue color #add8e6, and the runtime shader switches the blue with the green channel: we get mint green #ade6d8.

```js
import {Canvas, Text, RuntimeShader, Skia, Group, Circle} from "@shopify/react-native-skia";
 
const source = Skia.RuntimeEffect.Make(`
uniform shader image;
 
half4 main(float2 xy) {
  return image.eval(xy).rbga;
}
`)!;
 
export const RuntimeShaderDemo = () => {
  const r = 128;
  return (
    <Canvas style={{ flex: 1 }}>
      <Group>
        <RuntimeShader source={source} />
        <Circle cx={r} cy={r} r={r} color="lightblue" />
      </Group>
    </Canvas>
  );
};
```

#### Pixel Density
```RuntimeShader``` is not taking into account the pixel density scaling ([learn more why](https://issues.skia.org/issues/40044507)). To keep the image filter output crisp, We upscale the filtered drawing to the [pixel density of the app](https://reactnative.dev/docs/pixelratio). Once the drawing is filtered, we scale it back to the original size. This can be seen in the example below. These operations must be performed on a Skia layer via the ```layer``` property.

```js
import {Canvas, Text, RuntimeShader, Skia, Group, Circle, Paint, Fill, useFont} from "@shopify/react-native-skia";
import {PixelRatio} from "react-native";
 
const pd = PixelRatio.get();
const source = Skia.RuntimeEffect.Make(`
uniform shader image;
 
half4 main(float2 xy) {
  if (xy.x < 256 * ${pd}/2) {
    return color;
  }
  return image.eval(xy).rbga;
}
`)!;
 
export const RuntimeShaderDemo = () => {
  const r = 128;
  const font = useFont(require("./SF-Pro.ttf"), 24);
  return (
    <Canvas style={{ flex: 1 }}>
      <Group transform={[{ scale: 1 / pd }]}>
        <Group
          layer={
            <Paint>
              <RuntimeShader source={source} />
            </Paint>
          }
          transform={[{ scale: pd }]}
        >
          <Fill color="#b7c9e2" />
          <Text
            text="Hello World"
            x={16}
            y={32}
            color="#e38ede"
            font={font}
          />
        </Group>
      </Group>
    </Canvas>
  );
};
```

# Backdrop Filters
In Skia, backdrop filters are equivalent to their [CSS counterpart](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter). They allow you to apply image filters such as blurring to the area behind a [clipping mask](https://shopify.github.io/react-native-skia/docs/group#clipping-operations). A backdrop filter extends the [Group component](https://shopify.github.io/react-native-skia/docs/group#clipping-operations). All properties from the [group component](https://shopify.github.io/react-native-skia/docs/group) can be applied to a backdrop filter.

The [clipping mask](https://shopify.github.io/react-native-skia/docs/group#clipping-operations) will be used to restrict the area of the backdrop filter.

## Example
```js
import {
  Canvas,
  BackdropFilter,
  Image,
  ColorMatrix,
  useImage,
} from "@shopify/react-native-skia";
 
// https://kazzkiq.github.io/svg-color-filter/
const BLACK_AND_WHITE = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
];
 
const Filter = () => {
  const image = useImage(require("./assets/oslo.jpg"));
 
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      <BackdropFilter
        clip={{ x: 0, y: 128, width: 256, height: 128 }}
        filter={<ColorMatrix matrix={BLACK_AND_WHITE} />}
      />
    </Canvas>
  );
};
```

### Backdrop Blur
Creates a backdrop blur. All properties from the [group component](https://shopify.github.io/react-native-skia/docs/group) can be applied to a backdrop filter.

| Name | Type   | Description |
| ---- | ------ | ----------- |
| blur | number | Blur radius |

#### Example
```js
import {
  Canvas,
  Fill,
  Image,
  BackdropBlur,
  useImage,
} from "@shopify/react-native-skia";
 
const Filter = () => {
  const image = useImage(require("./assets/oslo.jpg"));
 
  return (
    <Canvas style={{ width: 256, height: 256 }}>
      <Image image={image} x={0} y={0} width={256} height={256} fit="cover" />
      <BackdropBlur blur={4} clip={{ x: 0, y: 128, width: 256, height: 128 }}>
        <Fill color="rgba(0, 0, 0, 0.2)" />
      </BackdropBlur>
    </Canvas>
  );
};
```