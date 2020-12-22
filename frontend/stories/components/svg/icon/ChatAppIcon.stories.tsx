import React from "react";
import { Story, Meta } from "@storybook/react";

import {
  ChatAppIcon,
  ChatAppIconProps,
} from "@frontend/components/svg/icon/ChatAppIcon";

export default {
  title: "components/svg/icon/ChatAppIcon",
  component: ChatAppIcon,
} as Meta;

const Template: Story<ChatAppIconProps> = (args) => <ChatAppIcon {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  h: "128px",
  w: "128px",
};
