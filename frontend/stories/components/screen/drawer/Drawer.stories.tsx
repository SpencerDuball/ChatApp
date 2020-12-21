import React from "react";
import { Story, Meta } from "@storybook/react";

import { Drawer, DrawerProps } from "@frontend/components/screen/drawer/Drawer";

export default {
  title: "components/screen/drawer/Drawer",
  component: Drawer,
} as Meta;

const Template: Story<DrawerProps> = (args) => <Drawer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  w: "320px",
  h: "100vh",
};
