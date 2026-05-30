import { ReceiptResponseDTO } from "@/types/receipts";
import { Modal } from "@mantine/core";
import { Dictionary } from "@/dictionaries";
import Content from "./content";
import classes from "./receipt-modal.module.css";

interface ReceiptModalProps {
  receipt?: ReceiptResponseDTO;
  onClose: () => void;
  opened: boolean;
  onSuccess: () => void;
  defaultVehicleId?: string;
  defaultClientId?: string;
}

const ReceiptModal = ({
  receipt,
  onClose,
  opened,
  onSuccess,
  defaultVehicleId,
  defaultClientId,
}: ReceiptModalProps) => {
  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size="md"
      title={receipt ? Dictionary.editReceipt : Dictionary.addNewReceipt}
      classNames={{
        title: classes.modalTitle,
      }}
    >
      <Content
        receipt={receipt}
        onSuccess={onSuccess}
        onClose={onClose}
        defaultVehicleId={defaultVehicleId}
        defaultClientId={defaultClientId}
      />
    </Modal>
  );
};

export default ReceiptModal;
