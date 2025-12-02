import Form from "./form";
import LeftPart from "./left-part/left-part";
import classes from "./login.module.css";

const LoginPage = () => {
  return (
    <div className={classes.page}>
      <LeftPart />
      <Form />
    </div>
  );
};

export default LoginPage;
