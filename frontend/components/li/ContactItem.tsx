import { HStack, StackProps, Avatar, Text, useToken } from "@chakra-ui/react";
import filterProps from "@frontend/util/filterProps";

export interface ContactItemProps extends StackProps {
  sub: string;
  givenName: string;
  familyName: string;
  profilePhotoUrl?: string;
  isSelected: boolean;
}

export const ContactItem = (props: ContactItemProps) => {
  const [brandGray100, brandGray200] = useToken("colors", [
    "brand.gray.100",
    "brand.gray.200",
  ]);

  return (
    <HStack
      as="button"
      outline="none"
      w="full"
      key={props.sub}
      bgColor={props.isSelected ? "brand.red.100" : "none"}
      px={3}
      py={2}
      borderRadius="md"
      {...filterProps(props, [
        "sub",
        "givenName",
        "familyName",
        "profilePhotoUrl",
        "isSelected",
      ])}
    >
      <Avatar
        size="sm"
        color="brand.gray.50"
        bg={`linear-gradient(${brandGray100}, ${brandGray200})`}
        name={`${props.givenName} ${props.familyName}`}
        src={props.profilePhotoUrl ? props.profilePhotoUrl : null}
      />
      <Text
        fontSize="sm"
        color="brand.gray.700"
        fontWeight="medium"
      >{`${props.givenName} ${props.familyName}`}</Text>
    </HStack>
  );
};
ContactItem.defaultProps = {
  isSelected: false,
};
