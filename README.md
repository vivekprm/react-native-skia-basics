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
