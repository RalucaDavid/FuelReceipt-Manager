import { Button, Title, Text } from "@mantine/core";
import { Dictionary } from "@/dictionaries";
import classes from "./receipts.module.css";
import { useEffect, useState } from "react";
import { ReceiptResponseDTO } from "@/types/receipts";
import { deleteReceipt, getAllReceipts } from "@/api/receipts";
import ReceiptsTable from "./receipts-table";
import ReceiptsSkeleton from "./receipts-table-skeleton";
import { useDisclosure } from "@mantine/hooks";
import ReceiptModal from "../modals/receipt-modal";
import ExportCSV from "./export-csv";

const ReceiptsPage = () => {
  const [allReceipts, setAllReceipts] = useState<ReceiptResponseDTO[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<
    ReceiptResponseDTO | undefined
  >(undefined);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllReceipts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReceipts();
      setAllReceipts(data);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReceipts();
  }, []);

  const handleDelete = async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      setAllReceipts((prev) => prev.filter((r) => r.id !== receiptId));
    } catch (err: unknown) {
      console.error(err);
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
      ) : allReceipts.length === 0 ? (
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
        onSuccess={fetchAllReceipts}
      />
    </div>
  );
};

export default ReceiptsPage;
