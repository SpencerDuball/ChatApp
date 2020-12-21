import React from "react";
import { Story, Meta } from "@storybook/react";

import { Footer, FooterProps } from "@frontend/components/screen/drawer/Footer";

export default {
  title: "components/screen/drawer/Footer",
  component: Footer,
} as Meta;

const Template: Story<FooterProps> = (args) => <Footer {...args} />;

export const Primary = Template.bind({});
