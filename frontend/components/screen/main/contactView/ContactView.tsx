import { Grid, BoxProps } from "@chakra-ui/react";

interface ContactViewProps extends BoxProps {}

const ContactView = (props: ContactViewProps) => {
  return <Grid {...props}></Grid>;
};

export default ContactView;
