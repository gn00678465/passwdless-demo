import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: false,
  format: ["esm"],
  legacyOutput: false,
  minify: true,
  metafile: true
});
