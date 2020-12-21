import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import colors from "./colors";

const themeExtensions = {
  colors: colors,
};

const breakpoints = createBreakpoints({
  sm: "22em",
  md: "40em",
  lg: "62em",
  xl: "80em",
});

export default extendTheme({ ...themeExtensions, breakpoints } as any); // TODO: Type issue, tracked here -> https://github.com/chakra-ui/chakra-ui/pull/2783
