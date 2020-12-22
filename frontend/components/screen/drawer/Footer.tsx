import { forwardRef } from "react";
import { Grid, GridProps, useToken } from "@chakra-ui/react";
import hexToRGB from "@frontend/util/hexToRGB";

export interface FooterProps extends GridProps {}

export const Footer = forwardRef<HTMLDivElement, FooterProps>((props, ref) => {
  const [brandGray50] = useToken("colors", ["brand.gray.50"]);

  return (
    <Grid
      w="full"
      py={5}
      zIndex="docked"
      bgColor={hexToRGB(brandGray50, 0.85)}
      style={{ backdropFilter: "blur(20px)" }}
      gridAutoFlow="column"
      justifyContent="center"
      gap="75px"
      ref={ref}
      {...props}
    >
      {props.children}
    </Grid>
  );
});
