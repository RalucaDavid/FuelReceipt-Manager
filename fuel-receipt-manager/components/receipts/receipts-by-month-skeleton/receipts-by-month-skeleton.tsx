import { Group, Paper, Skeleton, Stack } from "@mantine/core";

const ReceiptsByMonthSkeleton = () => (
  <Stack gap="sm">
    {[0, 1, 2].map((i) => (
      <Paper key={i} shadow="xs" radius="md" p="md" withBorder>
        <Group justify="space-between">
          <Skeleton height={20} width={160} radius="xl" />
          <Group gap="xl">
            <Skeleton height={24} width={80} radius="xl" />
            <Skeleton height={20} width={120} radius="xl" />
          </Group>
        </Group>
      </Paper>
    ))}
  </Stack>
);

export default ReceiptsByMonthSkeleton;
