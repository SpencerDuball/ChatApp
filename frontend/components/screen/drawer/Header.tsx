import {
  VStack,
  Flex,
  Avatar,
  Heading,
  HStack,
  StackProps,
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  useToken,
} from "@chakra-ui/react";
import { ChangeEvent, forwardRef } from "react";
import { ChatAppIcon } from "@frontend/components/svg/icon/ChatAppIcon";
import { IconButton } from "@frontend/components/button/IconButton";
import { IoPersonAdd, IoSearch } from "react-icons/io5";
import filterProps from "@frontend/util/filterProps";
import hexToRGB from "@frontend/util/hexToRGB";

export interface HeaderProps extends StackProps {
  profilePhotoUrl?: string;
  title: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const [brandGray50] = useToken("colors", ["brand.gray.50"]);

  return (
    <VStack
      px={3}
      py={4}
      w="full"
      zIndex="docked"
      bgColor={hexToRGB(brandGray50, 0.85)}
      style={{
        backdropFilter: "blur(20px)",
      }}
      ref={ref}
      {...filterProps(props, [
        "profilePhotoUrl",
        "title",
        "value",
        "handleChange",
      ])}
    >
      <Flex alignItems="center" w="full">
        <Avatar
          icon={<ChatAppIcon h="65%" w="65%" />}
          src={props.profilePhotoUrl ? props.profilePhotoUrl : null}
          bgColor="brand.gray.100"
          h={9}
          w={9}
        />
        <Heading as="h2" fontSize="lg" ml={2} color="brand.gray.700" flex="1">
          {props.title}
        </Heading>
        <HStack spacing={2}>
          <IconButton
            aria-label="Create contact"
            h={6}
            w={6}
            icon={<Icon as={IoPersonAdd} color="brand.gray.600" />}
          />
        </HStack>
      </Flex>
      <InputGroup size="sm">
        <InputLeftElement
          children={<Icon as={IoSearch} boxSize={5} color="brand.gray.600" />}
        />
        <Input
          borderRadius="md"
          variant="filled"
          bgColor="brand.gray.100"
          value={props.value}
          onChange={props.handleChange}
          placeholder="Search"
          _placeholder={{ color: "brand.gray.600" }}
        />
      </InputGroup>
    </VStack>
  );
});
