import classes from "./dashboard.module.css";
import HelloMessage from "./hello-message";

const DashboardPage = () => {
  return (
    <div className={classes.dashboardPage}>
      <HelloMessage />
      {/* {isLoading ? (
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
      )} */}
    </div>
  );
};

export default DashboardPage;
