import { Paper, Title } from "@mantine/core";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      style={{ background: "var(--color-background-main)" }}
    >
      <Title order={4} fw={600} mb="md" size="h4">
        {title}
      </Title>
      <div style={{ height: 280 }}>{children}</div>
    </Paper>
  );
};

export default ChartCard;
