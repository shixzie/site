// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// Self-hosted fonts, resolved offline from the @fontsource packages in node_modules.
// Only the latin subset is shipped (covers English + Spanish); Astro generates
// metric-matched fallbacks so the swap from system font → web font doesn't shift layout.
const latin =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export default defineConfig({
  site: "https://shixzie.com",
  trailingSlash: "ignore",
  fonts: [
    {
      name: "Geist",
      cssVariable: "--font-sans",
      provider: fontProviders.local(),
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      options: {
        variants: [
          {
            src: ["@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"],
            weight: "100 900",
            style: "normal",
            unicodeRange: [latin],
          },
        ],
      },
    },
    {
      name: "Geist Mono",
      cssVariable: "--font-mono",
      provider: fontProviders.local(),
      fallbacks: ["ui-monospace", "monospace"],
      options: {
        variants: [
          {
            src: ["@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2"],
            weight: "100 900",
            style: "normal",
            unicodeRange: [latin],
          },
        ],
      },
    },
    {
      name: "Instrument Serif",
      cssVariable: "--font-serif",
      provider: fontProviders.local(),
      fallbacks: ["ui-serif", "Georgia", "serif"],
      options: {
        variants: [
          {
            src: ["@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2"],
            weight: 400,
            style: "normal",
            unicodeRange: [latin],
          },
          {
            src: ["@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2"],
            weight: 400,
            style: "italic",
            unicodeRange: [latin],
          },
        ],
      },
    },
  ],
});
