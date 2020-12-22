import React from "react";
import { Story, Meta } from "@storybook/react";
import { IoKey } from "react-icons/io5";

import {
  IconButton,
  IconButtonProps,
} from "@frontend/components/button/IconButton";

export default {
  title: "components/button/IconButton",
  component: IconButton,
} as Meta;

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  w: "24px",
  h: "24px",
  icon: <IoKey />,
};
