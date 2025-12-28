import { useForm } from "@mantine/form";
import classes from "./register-form.module.css";
import { Dictionary } from "@/dictionaries";
import { Button, PasswordInput, TextInput } from "@mantine/core";

const RegisterForm = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    validate: {
      firstName: (value) => (value ? null : Dictionary.firstNameRequired),
      lastName: (value) => (value ? null : Dictionary.lastNameRequired),
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
      <div className={classes.nameContainer}>
        <TextInput
          withAsterisk
          className={classes.firstNameInput}
          label={Dictionary.firstName}
          placeholder={Dictionary.enterYourFirstName}
          key={form.key("firstName")}
          {...form.getInputProps("firstName")}
        />
        <TextInput
          withAsterisk
          className={classes.lastNameInput}
          label={Dictionary.lastName}
          placeholder={Dictionary.enterYourLastName}
          key={form.key("lastName")}
          {...form.getInputProps("lastName")}
        />
      </div>
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
        {Dictionary.register}
      </Button>
    </form>
  );
};

export default RegisterForm;
