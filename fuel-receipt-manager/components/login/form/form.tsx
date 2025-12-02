import { Title, Text, Tabs, FloatingIndicator } from "@mantine/core";
import classes from "./form.module.css";
import { useState } from "react";
import { Dictionary } from "@/dictionaries";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const Form = () => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("Sign In");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <div className={classes.formContainer}>
      <Title order={1} className={classes.title}>
        {Dictionary.welcomeToFuelReceiptsManager}
      </Title>
      <Text className={classes.description}>{Dictionary.loginDescription}</Text>
      <Tabs
        variant="none"
        value={value}
        onChange={setValue}
        className={classes.tabsContainer}
      >
        <Tabs.List ref={setRootRef} className={classes.list}>
          <Tabs.Tab
            value="Sign In"
            ref={setControlRef("Sign In")}
            className={classes.tab}
          >
            {Dictionary.logIn}
          </Tabs.Tab>
          <Tabs.Tab
            value="Register"
            ref={setControlRef("Register")}
            className={classes.tab}
          >
            {Dictionary.register}
          </Tabs.Tab>

          <FloatingIndicator
            target={value ? controlsRefs[value] : null}
            parent={rootRef}
            className={classes.indicator}
          />
        </Tabs.List>

        <Tabs.Panel value="Sign In" className={classes.panel}>
          <LoginForm />
        </Tabs.Panel>
        <Tabs.Panel value="Register" className={classes.panel}>
          <RegisterForm />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Form;
