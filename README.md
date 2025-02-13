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