import React from "react";
import { Story, Meta } from "@storybook/react";
import { Box } from "@chakra-ui/react";

import {
  HeroBackground,
  HeroBackgroundProps,
} from "@frontend/components/svg/background/HeroBackground";

export default {
  title: "components/svg/background/HeroBackground",
  component: HeroBackground,
} as Meta;

const Template: Story<HeroBackgroundProps> = (args) => (
  <HeroBackground {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  h: "300px",
  fill: "red.200",
};

export const Responsive = () => (
  <Box h="100vh" w="100%" position="relative" overflow="hidden">
    <HeroBackground
      h="100%"
      fill="brand.gold.50"
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
    />
  </Box>
);
