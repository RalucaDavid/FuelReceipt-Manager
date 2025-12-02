import { Title, Text } from "@mantine/core";
import classes from "./left-part.module.css";
import { BsBoxFill } from "react-icons/bs";
import { Dictionary } from "@/dictionaries";

const LeftPart = () => {
  return (
    <div className={classes.backgroundContainer}>
      <div className={classes.contentCenter}>
        <div className={classes.titleContainer}>
          <BsBoxFill size={48} className={classes.icon} />
          <Title order={1} className={classes.mainTitle}>
            {Dictionary.fuelReceiptsManager}
          </Title>
        </div>
        <Text size="lg" className={classes.subTitle}>
          {Dictionary.manageYourFuelReceiptsWithEase}
        </Text>
      </div>
    </div>
  );
};

export default LeftPart;
