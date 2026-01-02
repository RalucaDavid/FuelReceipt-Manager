import { Dictionary } from "@/dictionaries";
import { Title } from "@mantine/core";
import classes from "./dashboard.module.css";

const DashboardPage = () => {
  return (
    <div>
      <Title>{Dictionary.dashboard}</Title>
    </div>
  );
};

export default DashboardPage;
