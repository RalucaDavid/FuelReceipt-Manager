import { FaRegCreditCard, FaTrash } from "react-icons/fa";
import { Table, Badge, Text, Group, ActionIcon, Paper } from "@mantine/core";
import { MdEdit } from "react-icons/md";
import { IoIosCash } from "react-icons/io";
import { ReceiptResponseDTO } from "@/types/receipts";
import { Dictionary } from "@/dictionaries";
import classes from "./receipts-table.module.css";

interface ReceiptsTableProps {
  receipts: ReceiptResponseDTO[];
  onUpdate: (receipt: ReceiptResponseDTO) => void;
  onDelete: (receiptId: string) => void;
}

const ReceiptsTable = ({
  receipts,
  onUpdate,
  onDelete,
}: ReceiptsTableProps) => {
  const rows = receipts.map((receipt) => (
    <Table.Tr key={receipt.id}>
      <Table.Td>
        <Text size="sm">{receipt.cif}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500}>
          {new Date(receipt.date).toLocaleDateString("ro-RO")}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm">{receipt.receiptNumber}</Text>
      </Table.Td>

      <Table.Td>
        <Badge
          color={receipt.fuelType === "DIESEL" ? "gray" : "yellow"}
          variant="light"
        >
          {receipt.fuelType}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          {receipt.paymentMethod === "CARD" ? (
            <FaRegCreditCard size={16} color="brown" />
          ) : (
            <IoIosCash size={16} color="green" />
          )}
          <Text size="sm">{receipt.paymentMethod}</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={700} c="blue">
          {receipt.total.toFixed(2)} RON
        </Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => onUpdate(receipt)}
          >
            <MdEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => onDelete(receipt.id)}
          >
            <FaTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="sm" radius="md" p="md" withBorder>
      <Table verticalSpacing="sm" highlightOnHover>
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

export default ReceiptsTable;
