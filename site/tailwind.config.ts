import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import { palette } from "./palette.config";
import fonts from "./tw-plugin/font";

export default {
  content: [
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      screens: {

      }
    },
  },
  darkMode: "class",
  plugins: [
    fonts(),
    nextui({
      themes: {
        holewinski: {
          colors: {
            ...palette,
            background: "#374046",
            primary: "#8E6A55",
            foreground: "#ABAD71",
          },
        },
      },
    }),
  ],
} satisfies Config;
