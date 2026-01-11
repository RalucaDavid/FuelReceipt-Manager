import { Dictionary } from "@/dictionaries";
import { Center, Loader, Title } from "@mantine/core";
import classes from "./dahsboard.module.css";
import HelloMessage from "./hello-message";
import ReceiptsChart from "./receipts-chart/receipts-chart";
import { ReceiptResponseDTO } from "@/types/receipts";
import { useEffect, useState } from "react";
import { getAllReceipts } from "@/api/receipts";
import FuelTypeChart from "./fuel-type-chart";

const DashboardPage = () => {
  const [allReceipts, setAllReceipts] = useState<ReceiptResponseDTO[]>([]);
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

  return (
    <div className={classes.dashboardPage}>
      <Title>{Dictionary.dashboard}</Title>
      <HelloMessage />
      {isLoading ? (
        <Center style={{ paddingTop: 16 }}>
          <Loader />
        </Center>
      ) : (
        <div className={classes.chartsContainer}>
          <div className={classes.chart}>
            <FuelTypeChart receipts={allReceipts} />
          </div>
          <div className={classes.chart}>
            <ReceiptsChart receipts={allReceipts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
