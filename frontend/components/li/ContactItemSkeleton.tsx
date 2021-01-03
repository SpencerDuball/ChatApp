import { HStack, StackProps, Avatar, Text, Skeleton } from "@chakra-ui/react";

export const ContactItemSkeleton = (props: StackProps) => {
  return (
    <HStack w="full" px={3} py={2} borderRadius="md">
      <Skeleton endColor="brand.gray.100" borderRadius="full">
        <Avatar size="sm" color="brand.gray.50" />
      </Skeleton>
      <Skeleton endColor="brand.gray.100" borderRadius="full" w="full" h={3} />
    </HStack>
  );
};
