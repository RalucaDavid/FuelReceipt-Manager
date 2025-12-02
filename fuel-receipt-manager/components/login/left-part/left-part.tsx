import { Title, Text } from "@mantine/core";
import { Dictionary } from "@/dictionaries";
import classes from "./left-part.module.css";
import { BsBoxFill } from "react-icons/bs";

const LeftPart = () => {
  return (
    <div>
      <BsBoxFill />
      <Title>{Dictionary.fuelTracker}</Title>
      <Text>{Dictionary.effortlessFuelExpenseTracking}</Text>
    </div>
  );
};

export default LeftPart;
