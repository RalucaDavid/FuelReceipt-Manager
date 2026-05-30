import { useMemo } from "react";
import {
  Paper,
  Text,
  Title,
  Group,
  ThemeIcon,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import { IoReceiptSharp } from "react-icons/io5";
import { MdAttachMoney, MdCalendarMonth, MdTrendingUp, MdPeople } from "react-icons/md";
import { ReceiptResponseDTO } from "@/types/receipts";
import { Dictionary } from "@/dictionaries";
import classes from "./stats-cards.module.css";

interface StatsCardsProps {
  receipts: ReceiptResponseDTO[];
  isLoading: boolean;
  clientCount?: number;
}

const StatsCards = ({ receipts, isLoading, clientCount }: StatsCardsProps) => {
  const stats = useMemo(() => {
    if (!receipts || receipts.length === 0) {
      return {
        totalReceipts: 0,
        totalSpent: "0.00",
        thisMonthSpent: "0.00",
        avgReceipt: "0.00",
      };
    }
    const now = new Date();
    const thisMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const totalSpent = receipts.reduce(
      (sum, r) => sum + (Number(r.total) || 0),
      0,
    );
    const thisMonthSpent = receipts
      .filter((r) => r.date?.startsWith(thisMonthPrefix))
      .reduce((sum, r) => sum + (Number(r.total) || 0), 0);
    return {
      totalReceipts: receipts.length,
      totalSpent: totalSpent.toFixed(2),
      thisMonthSpent: thisMonthSpent.toFixed(2),
      avgReceipt: (totalSpent / receipts.length).toFixed(2),
    };
  }, [receipts]);

  const cards = [
    ...(clientCount !== undefined
      ? [{ label: Dictionary.clients, value: String(clientCount), icon: MdPeople, color: "teal" }]
      : []),
    {
      label: Dictionary.totalReceipts,
      value: String(stats.totalReceipts),
      icon: IoReceiptSharp,
      color: "blue",
    },
    {
      label: Dictionary.totalSpent,
      value: `${stats.totalSpent} RON`,
      icon: MdAttachMoney,
      color: "green",
    },
    {
      label: Dictionary.thisMonth,
      value: `${stats.thisMonthSpent} RON`,
      icon: MdCalendarMonth,
      color: "orange",
    },
    ...(clientCount === undefined
      ? [{ label: Dictionary.avgReceipt, value: `${stats.avgReceipt} RON`, icon: MdTrendingUp, color: "violet" }]
      : []),
  ];

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={100} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {cards.map((card) => (
        <Paper
          key={card.label}
          className={classes.card}
          p="lg"
          radius="md"
          withBorder
        >
          <Group justify="space-between" align="flex-start">
            <div>
              <Text
                size="xs"
                c="dimmed"
                fw={600}
                tt="uppercase"
                style={{ letterSpacing: "0.06em" }}
              >
                {card.label}
              </Text>
              <Title order={3} fw={700} mt={6} size="h3">
                {card.value}
              </Title>
            </div>
            <ThemeIcon size={44} radius="md" color={card.color} variant="light">
              <card.icon size={22} />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
};

export default StatsCards;
