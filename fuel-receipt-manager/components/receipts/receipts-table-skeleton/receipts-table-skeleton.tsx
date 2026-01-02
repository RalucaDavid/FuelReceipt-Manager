import { Table, Skeleton, Paper } from "@mantine/core";
import { Dictionary } from "@/dictionaries";
import classes from "./receipts-table-skeleton.module.css";

const ReceiptsSkeleton = () => {
  const rows = Array(5)
    .fill(0)
    .map((_, index) => (
      <Table.Tr key={index}>
        <Table.Td>
          <Skeleton height={15} width="60%" radius="xl" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={15} width="60%" radius="xl" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={20} width={80} radius="md" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={15} width="40%" radius="xl" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={15} width="30%" radius="xl" />
        </Table.Td>
        <Table.Td>
          <Skeleton height={25} circle />
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{Dictionary.cif}</Table.Th>
            <Table.Th>{Dictionary.date}</Table.Th>
            <Table.Th>{Dictionary.receiptNumber}</Table.Th>
            <Table.Th>{Dictionary.fuelType}</Table.Th>
            <Table.Th>{Dictionary.paymentMethod}</Table.Th>
            <Table.Th>{Dictionary.total}</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Paper>
  );
};

export default ReceiptsSkeleton;
