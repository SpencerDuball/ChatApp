import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";

const themeExtensions = {
  colors: colors,
};

export default extendTheme(themeExtensions as any); // TODO: Type issue, tracked here -> https://github.com/chakra-ui/chakra-ui/pull/2783
