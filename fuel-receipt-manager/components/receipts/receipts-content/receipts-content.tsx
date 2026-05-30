"use client";

import { useState } from "react";
import { ReceiptResponseDTO } from "@/types/receipts";
import classes from "./receipts-content.module.css";
import ReceiptModal from "@/components/modals/receipt-modal";
import { Dictionary } from "@/dictionaries";
import ExportCSV from "../export-csv";
import { Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useReceipts from "@/hooks/useReceipts";
import { deleteReceipt } from "@/api/receipts";
import { notifications } from "@mantine/notifications";
import ReceiptsByMonth from "../receipts-by-month";
import ReceiptsByMonthSkeleton from "../receipts-by-month-skeleton";

interface ReceiptsContentProps {
  receipts?: ReceiptResponseDTO[];
  isLoading?: boolean;
  mutate?: () => void;
  defaultVehicleId?: string;
}

const ReceiptsContent = ({
  receipts: externalReceipts,
  isLoading: externalLoading,
  mutate: externalMutate,
  defaultVehicleId,
}: ReceiptsContentProps = {}) => {
  const {
    allReceipts: hookReceipts,
    isLoading: hookLoading,
    mutate: hookMutate,
  } = useReceipts();

  const allReceipts = externalReceipts ?? hookReceipts;
  const isLoading = externalLoading ?? hookLoading;
  const mutate = externalMutate ?? hookMutate;
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
    <>
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
        <ReceiptsByMonthSkeleton />
      ) : !allReceipts || allReceipts.length === 0 ? (
        <Text>{Dictionary.thereAreNoReceipts}</Text>
      ) : (
        <ReceiptsByMonth
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
        defaultVehicleId={defaultVehicleId}
      />
    </>
  );
};

export default ReceiptsContent;
