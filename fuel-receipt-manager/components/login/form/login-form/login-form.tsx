import { useForm } from "@mantine/form";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import classes from "./login-form.module.css";
import { Dictionary } from "@/dictionaries";

const LoginForm = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => {
        if (!value) {
          return Dictionary.emailRequired;
        }
        return /^\S+@\S+$/.test(value) ? null : Dictionary.invalidEmail;
      },
      password: (value) => {
        if (!value) {
          return Dictionary.passwordRequired;
        }
        if (value.length < 8) {
          return Dictionary.passwordMinLength;
        }
        return null;
      },
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => console.log(values))}
      className={classes.form}
    >
      <TextInput
        withAsterisk
        label={Dictionary.emailAddress}
        placeholder={Dictionary.enterYourEmailAddress}
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <PasswordInput
        withAsterisk
        label={Dictionary.password}
        placeholder={Dictionary.enterYourPassword}
        key={form.key("password")}
        {...form.getInputProps("password")}
      />
      <Button type="submit" className={classes.button}>
        {Dictionary.logIn}
      </Button>
    </form>
  );
};

export default LoginForm;
