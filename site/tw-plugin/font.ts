import plugin from "tailwindcss/plugin";

export default function () {
  return plugin(({ addUtilities }) => {
    addUtilities({
      ".font-header": {
        fontFamily: "'M PLUS Rounded 1c'",
      },
      ".font-body": {
        fontFamily: "Raleway",
      },
    });
  });
}
