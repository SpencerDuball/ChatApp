import { forwardRef } from "react";
import { Grid, GridProps, Icon } from "@chakra-ui/react";
import { IconButton } from "@frontend/components/button/IconButton";

export interface FooterProps extends GridProps {}

export const Footer = forwardRef<HTMLDivElement, FooterProps>((props, ref) => {
  return (
    <Grid
      position="absolute"
      top="0"
      left="0"
      w="full"
      bgColor="brand.gray.50"
      opacity="0.85"
      zIndex="docked"
      style={{ backdropFilter: "blur(30px)" }}
      ref={ref}
      {...props}
    ></Grid>
  );
});
