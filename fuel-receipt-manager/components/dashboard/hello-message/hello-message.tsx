import { Text, Skeleton, Title, Stack, Box } from "@mantine/core";
import classes from "./hello-message.module.css";
import { Dictionary } from "@/dictionaries";
import useUser from "@/hooks/useUser";

const HelloMessage = () => {
  const { user, isLoading } = useUser();

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return Dictionary.goodMorning;
    if (hour < 18) return Dictionary.goodAfternoon;
    return Dictionary.goodEvening;
  };

  if (isLoading) {
    return (
      <Box className={classes.container} my="xl">
        <Skeleton height={40} width={300} radius="sm" mb="xs" />
        <Skeleton height={20} width={150} radius="sm" />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Stack gap={0} className={classes.container} my="xl">
      <Title order={1} size="h1" fw={800} style={{ letterSpacing: "-1px" }}>
        {getGreeting()},{" "}
        <Text span c="blue" inherit>
          {user.firstName}
        </Text>
      </Title>
      <Text c="dimmed" size="md" tt="capitalize">
        {Dictionary.todayIs} {getCurrentDate()}
      </Text>
    </Stack>
  );
};

export default HelloMessage;
