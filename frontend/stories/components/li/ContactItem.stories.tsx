import React from "react";
import { Story, Meta } from "@storybook/react";

import {
  ContactItem,
  ContactItemProps,
} from "@frontend/components/li/ContactItem";

export default {
  title: "components/li/ContactItem",
  component: ContactItem,
} as Meta;

const Template: Story<ContactItemProps> = (args) => <ContactItem {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  sub: "332901",
  givenName: "Spencer",
  familyName: "Duball",
};

export const Selected = Template.bind({});
Selected.args = {
  sub: "309235",
  givenName: "Spencer",
  familyName: "Duball",
  isSelected: true,
};
