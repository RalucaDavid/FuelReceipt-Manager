import { Title } from "@mantine/core";
import { Dictionary } from "@/dictionaries";
import classes from "./receipts.module.css";
import ReceiptsContent from "./receipts-content/receipts-content";

const ReceiptsPage = () => {
  return (
    <div className={classes.receiptsPage}>
      <Title>{Dictionary.receipts}</Title>
      <ReceiptsContent />
    </div>
  );
};

export default ReceiptsPage;
