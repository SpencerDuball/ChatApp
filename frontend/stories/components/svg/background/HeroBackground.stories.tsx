import React from "react";
import { Story, Meta } from "@storybook/react";

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
  w: ["200px", "300px", "400px"],
  fill: "red.200",
};
