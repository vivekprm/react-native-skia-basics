/**
 * @jest-environment @shopify/react-native-skia/jestEnv.mjs
 */
import "react-native";
import React from "react";
import { cleanup, render } from "@testing-library/react-native";
import App from "./App";

it("renders correctly", () => {
  render(<App />);
});

afterEach(cleanup);