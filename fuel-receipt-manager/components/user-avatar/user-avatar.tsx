import { Avatar, Box, Group, Skeleton, Text } from "@mantine/core";
import classes from "./user-avatar.module.css";
import { Dictionary } from "@/dictionaries";
import { logoutUser } from "@/api/auth";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";

const UserAvatar = () => {
  const { user, isLoading, mutate } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      mutate(null, false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <Group className={classes.userSection}>
        <Skeleton height={38} circle />
        <Box className={classes.box} style={{ flex: 1 }}>
          <Skeleton height={12} width="80%" mb={6} />
          <Skeleton height={8} width="40%" />
        </Box>
      </Group>
    );
  }

  return (
    <Group className={classes.userSection}>
      <Avatar color="blue" radius="xl">
        {user?.firstName?.[0] || ""}
        {user?.lastName?.[0] || ""}
      </Avatar>
      <Box className={classes.box}>
        <Text size="sm">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text
          size="xs"
          c="dimmed"
          className={classes.logoutText}
          onClick={handleLogout}
        >
          {Dictionary.logout}
        </Text>
      </Box>
    </Group>
  );
};

export default UserAvatar;
