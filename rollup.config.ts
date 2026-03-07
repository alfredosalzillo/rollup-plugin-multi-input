import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import type { RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";

const config: RollupOptions[] = [
  {
    input: "src/plugin.ts",
    output: [
      {
        format: "cjs",
        file: "dist/plugin.cjs",
      },
      {
        format: "es",
        file: "dist/plugin.js",
      },
    ],
    external: ["react"],
    plugins: [nodeResolve(), commonjs(), swc()],
  },
  {
    input: "src/plugin.ts",
    output: {
      file: "dist/plugin.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];

export default config;