import React from "react";
import { Story, Meta } from "@storybook/react";
import { Box, BoxProps } from "@chakra-ui/react";

const NewComponent = (props: BoxProps) => {
  return <Box {...props} />;
};

export default {
  title: "components/NewComponent",
  component: NewComponent,
} as Meta;

const Template: Story<BoxProps> = (args) => <NewComponent {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  h: "3xs",
  w: "3xs",
  bg: "red.200",
};
