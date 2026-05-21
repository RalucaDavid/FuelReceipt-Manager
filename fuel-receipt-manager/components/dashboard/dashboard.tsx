import { Center, Loader } from "@mantine/core";
import classes from "./dashboard.module.css";
import HelloMessage from "./hello-message";
import StatsCards from "./stats-cards/stats-cards";
import ChartCard from "./chart-card/chart-card";
import FuelTypeChart from "./fuel-type-chart/fuel-type-chart";
import ReceiptsChart from "./receipts-chart/receipts-chart";
import RecentReceipts from "./recent-receipts/recent-receipts";
import useReceipts from "@/hooks/useReceipts";
import { Dictionary } from "@/dictionaries";

const DashboardPage = () => {
  const { allReceipts, isLoading } = useReceipts();
  const receipts = allReceipts ?? [];

  return (
    <div className={classes.dashboardPage}>
      <HelloMessage />
      <StatsCards receipts={receipts} isLoading={isLoading} />
      {isLoading ? (
        <Center style={{ paddingTop: 32 }}>
          <Loader />
        </Center>
      ) : (
        <>
          <div className={classes.chartsGrid}>
            <ChartCard title={Dictionary.monthlySpending}>
              <ReceiptsChart receipts={receipts} />
            </ChartCard>
            <ChartCard title={Dictionary.spendingByFuelType}>
              <FuelTypeChart receipts={receipts} />
            </ChartCard>
          </div>

          <RecentReceipts receipts={receipts} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
