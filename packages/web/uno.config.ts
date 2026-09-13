import { defineConfig, presetWind3 } from "unocss";
import presetIcons from "@unocss/preset-icons";

export default defineConfig({
  // Library CSS includes its utilities and icons, without changing application-wide defaults.
  presets: [presetWind3({ preflight: false }), presetIcons()],
  safelist: [],
  layers: {
    utilities: -1,
  },
});
