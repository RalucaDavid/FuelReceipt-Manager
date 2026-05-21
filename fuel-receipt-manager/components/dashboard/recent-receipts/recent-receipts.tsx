import { Paper, Title, Table, Badge, Text } from "@mantine/core";
import { ReceiptResponseDTO } from "@/types/receipts";
import { Dictionary } from "@/dictionaries";

interface RecentReceiptsProps {
  receipts: ReceiptResponseDTO[];
}

const fuelColor: Record<string, string> = {
  DIESEL: "gray",
  GASOLINE: "yellow",
};
const paymentColor: Record<string, string> = { CASH: "green", CARD: "violet" };

const RecentReceipts = ({ receipts }: RecentReceiptsProps) => {
  const recent = [...(receipts ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      style={{ background: "var(--color-background-main)" }}
    >
      <Title order={4} fw={600} mb="md" size="h4">
        {Dictionary.recentReceipts}
      </Title>
      {recent.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {Dictionary.noReceiptsYet}
        </Text>
      ) : (
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{Dictionary.date}</Table.Th>
              <Table.Th>{Dictionary.receiptNumber}</Table.Th>
              <Table.Th>{Dictionary.cif}</Table.Th>
              <Table.Th>{Dictionary.fuelType}</Table.Th>
              <Table.Th>{Dictionary.paymentMethod}</Table.Th>
              <Table.Th>{Dictionary.total}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {recent.map((r) => (
              <Table.Tr key={r.id}>
                <Table.Td>
                  {new Date(r.date).toLocaleDateString("en-GB")}
                </Table.Td>
                <Table.Td>{r.receiptNumber}</Table.Td>
                <Table.Td c="dimmed">{r.cif}</Table.Td>
                <Table.Td>
                  <Badge
                    color={fuelColor[r.fuelType] ?? "gray"}
                    variant="light"
                    size="sm"
                  >
                    {r.fuelType}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={paymentColor[r.paymentMethod] ?? "gray"}
                    variant="light"
                    size="sm"
                  >
                    {r.paymentMethod}
                  </Badge>
                </Table.Td>
                <Table.Td fw={600}>{Number(r.total).toFixed(2)} RON</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Paper>
  );
};

export default RecentReceipts;
