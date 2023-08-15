import { ChakraTheme, StyleFunctionProps, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import "src/fonts";

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode("#f0e7db", "#202023")(props),
    },
  }),
} satisfies ChakraTheme["styles"];

const components = {
  Heading: {
    variants: {
      "section-title": {
        textDecoration: "underline",
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: "#525252",
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4,
      },
    },
  },
  Link: {
    baseStyle: (props: StyleFunctionProps) => ({
      color: mode("#3d7aed", "#ff63c3")(props),
      textUnderlineOffset: 3,
    }),
  },
};

const fonts = {
  heading: "'M PLUS Rounded 1c'",
  body: "'Raleway'",
} satisfies ChakraTheme["fonts"];

const colors = {} satisfies ChakraTheme["colors"];

const semanticTokens = {
  accent: {
    default: "#8C5E58",
    _dark: "#8C5E58",
  },
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles,
  components,
  fonts,
  colors,
  semanticTokens,
});
export default theme;
