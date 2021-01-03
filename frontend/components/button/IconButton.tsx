import { Center, CenterProps } from "@chakra-ui/react";
import filterProps from "util/filterProps";

export interface IconButtonProps extends CenterProps {
  icon: React.ReactElement;
}

export const IconButton = (props: IconButtonProps) => {
  return (
    <Center
      as="button"
      transition="all 0.2s cubic-bezer(0.08,.52,.52,1)"
      bgColor="brand.gray.100"
      borderRadius="md"
      outline="none"
      _active={{
        bg: "brand.gray.200",
        transform: "scale(0.98)",
      }}
      _focus={{
        boxShadow: "0 0 0 3px rgba(66, 153, 255, 0.6)",
      }}
      {...filterProps(props, ["icon"])}
    >
      {props.icon}
    </Center>
  );
};
