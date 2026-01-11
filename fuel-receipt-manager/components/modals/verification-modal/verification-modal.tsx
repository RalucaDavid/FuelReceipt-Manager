import { Button, Modal } from "@mantine/core";
import classes from "./verification-modal.module.css";
import { Dictionary } from "@/dictionaries";

interface VerificationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  title: string;
}

const VerificationModal = ({
  opened,
  onClose,
  children,
  title,
  onConfirm,
}: VerificationModalProps) => {
  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size="md"
      title={title}
      classNames={{
        title: classes.modalTitle,
      }}
    >
      {children}
      <div className={classes.buttonsContainer}>
        <Button onClick={onClose}>{Dictionary.cancel}</Button>
        <Button color="red" onClick={onConfirm}>
          {Dictionary.confirm}
        </Button>
      </div>
    </Modal>
  );
};

export default VerificationModal;
