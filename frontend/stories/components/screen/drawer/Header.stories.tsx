import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import {
  Header,
  HeaderProps,
} from "@frontend/components/screen/drawer/components/Header";

export default {
  title: "components/screen/drawer/Header",
  component: Header,
} as Meta;

const Template: Story<HeaderProps> = (args) => {
  const [value, setValue] = useState("");
  return (
    <Header
      {...args}
      value={value}
      handleChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Contacts = Template.bind({});
Contacts.args = {
  w: "600px",
  title: "Contacts",
};

export const ContactsWithAvatar = Template.bind({});
ContactsWithAvatar.args = {
  w: "600px",
  title: "Contacts",
  profilePhotoUrl: "https://bit.ly/sage-adebayo",
};
