import { Avatar, Box, Group, Skeleton, Text } from "@mantine/core";
import classes from "./user-avatar.module.css";
import { Dictionary } from "@/dictionaries";
import { getCurrentUser, logoutUser } from "@/api/auth";
import { useEffect, useState } from "react";
import { UserResponseDTO } from "@/types/auth";
import { useRouter } from "next/navigation";

const UserAvatar = () => {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
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
