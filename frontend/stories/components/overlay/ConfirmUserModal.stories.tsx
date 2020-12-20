import React from "react";
import { Story, Meta } from "@storybook/react";

import {
  ConfirmUserModal,
  ConfirmUserModalProps,
} from "@frontend/components/overlay/ConfirmUserModal";

export default {
  title: "components/overlay/ConfirmUserModal",
  component: ConfirmUserModal,
} as Meta;

const Template: Story<ConfirmUserModalProps> = (args) => (
  <ConfirmUserModal
    isOpen={true}
    onOpen={() => console.log("Open Event")}
    onClose={() => console.log("Close Event")}
    credentials={{ username: "Username", password: "Password" }}
    {...args}
  />
);

export const Primary = Template.bind({});
