// @unocss-include

import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  presetTypography,
  presetWebFonts
} from "unocss";
import type { UserConfig } from "unocss";

export const config: UserConfig = {
  content: {
    pipeline: {
      exclude: ["node_modules", ".git", "dist"]
    }
  },
  presets: [
    presetUno({ dark: "class" }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Roboto",
        mono: ["Fira Code", "Fira Mono:400,700"]
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    // position layout
    "position-x-center": "absolute left-1/2 -translate-x-1/2",
    "position-y-center": "absolute top-1/2 -translate-y-1/2",
    "position-center": "position-x-center position-y-center",

    // size
    "size-0": "w-0 h-0",
    "size-full": "w-full h-full",
    "size-screen": "w-screen h-screen",
    "size-1/2": "w-1/2 h-1/2",

    // flex layout
    "flex-center": "flex justify-center items-center",
    "flex-col-center": "flex-center flex-col",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center"
  },
  rules: [
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${parseInt(d) / 4}rem` })],
    [/^p-(\d+)$/, (match) => ({ padding: `${parseInt(match[1]) / 4}rem` })]
  ]
};
