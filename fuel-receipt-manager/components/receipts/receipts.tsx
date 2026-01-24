import { Button, Title, Text } from "@mantine/core";
import { Dictionary } from "@/dictionaries";
import classes from "./receipts.module.css";
import { useState } from "react";
import { ReceiptResponseDTO } from "@/types/receipts";
import { deleteReceipt } from "@/api/receipts";
import ReceiptsTable from "./receipts-table";
import ReceiptsSkeleton from "./receipts-table-skeleton";
import { useDisclosure } from "@mantine/hooks";
import ReceiptModal from "../modals/receipt-modal";
import ExportCSV from "./export-csv";
import useReceipts from "@/hooks/useReceipts";
import { notifications } from "@mantine/notifications";

const ReceiptsPage = () => {
  const { allReceipts, isLoading, mutate } = useReceipts();
  const [selectedReceipt, setSelectedReceipt] = useState<
    ReceiptResponseDTO | undefined
  >(undefined);
  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      mutate();
      notifications.show({
        title: Dictionary.success,
        message: Dictionary.theReceiptHasBeenDeleted,
        color: "green",
        autoClose: 3000,
        withBorder: true,
      });
    } catch (err: unknown) {
      notifications.show({
        title: Dictionary.error,
        message: Dictionary.theReceiptCouldNotBeDeleted,
        color: "red",
        autoClose: 3000,
        withBorder: true,
      });
    }
  };

  const handleOpenEdit = (receipt: ReceiptResponseDTO) => {
    setSelectedReceipt(receipt);
    open();
  };

  const handleOpenCreate = () => {
    setSelectedReceipt(undefined);
    open();
  };

  return (
    <div className={classes.receiptsPage}>
      <Title>{Dictionary.receipts}</Title>
      <div className={classes.buttonsContainer}>
        <ExportCSV receipts={allReceipts} />
        <Button
          className={classes.button}
          loading={isLoading}
          onClick={handleOpenCreate}
        >
          {Dictionary.addNewReceipt}
        </Button>
      </div>
      {isLoading ? (
        <ReceiptsSkeleton />
      ) : allReceipts?.length === 0 ? (
        <Text>{Dictionary.thereAreNoReceipts}</Text>
      ) : (
        <ReceiptsTable
          receipts={allReceipts}
          onUpdate={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}
      <ReceiptModal
        receipt={selectedReceipt}
        opened={opened}
        onClose={close}
        onSuccess={() => mutate()}
      />
    </div>
  );
};

export default ReceiptsPage;
