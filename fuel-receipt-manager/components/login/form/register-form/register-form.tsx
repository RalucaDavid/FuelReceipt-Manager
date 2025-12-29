import { useForm } from "@mantine/form";
import { Dictionary } from "@/dictionaries";
import { Button, PasswordInput, TextInput, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./register-form.module.css";
import { CreateUserDTO } from "@/types/auth";
import { loginUser, registerUser } from "@/api/auth";

const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegister = async (values: CreateUserDTO) => {
    setError(null);
    setIsLoading(true);
    try {
      await registerUser(values);
      await loginUser({
        email: values.email,
        password: values.password,
      });
      router.refresh();
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : Dictionary.authenticationFailed
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => handleRegister(values))}
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
          disabled={isLoading}
        />
        <TextInput
          withAsterisk
          className={classes.lastNameInput}
          label={Dictionary.lastName}
          placeholder={Dictionary.enterYourLastName}
          key={form.key("lastName")}
          {...form.getInputProps("lastName")}
          disabled={isLoading}
        />
      </div>
      <TextInput
        withAsterisk
        label={Dictionary.emailAddress}
        placeholder={Dictionary.enterYourEmailAddress}
        key={form.key("email")}
        {...form.getInputProps("email")}
        disabled={isLoading}
      />
      <PasswordInput
        withAsterisk
        label={Dictionary.password}
        placeholder={Dictionary.enterYourPassword}
        key={form.key("password")}
        {...form.getInputProps("password")}
        disabled={isLoading}
      />
      <Button type="submit" className={classes.button} loading={isLoading}>
        {Dictionary.register}
      </Button>
      {error && (
        <Text color="red" size="xs" ta="center" mt={4}>
          {error}
        </Text>
      )}
    </form>
  );
};

export default RegisterForm;
