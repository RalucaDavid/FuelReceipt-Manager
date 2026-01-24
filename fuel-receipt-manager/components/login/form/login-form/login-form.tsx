import { useForm } from "@mantine/form";
import { Button, PasswordInput, TextInput, Text } from "@mantine/core";
import classes from "./login-form.module.css";
import { Dictionary } from "@/dictionaries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCurrentUserURL, loginUser } from "@/api/auth";
import { LoginRequestDTO } from "@/types/auth";
import { mutate } from "swr";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async (values: LoginRequestDTO) => {
    setError(null);
    setIsLoading(true);
    try {
      await loginUser(values);
      await mutate(getCurrentUserURL());
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : Dictionary.authenticationFailed,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => handleLogin(values))}
      className={classes.form}
    >
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
        {Dictionary.logIn}
      </Button>
      {error && (
        <Text color="red" size="xs" ta="center" mt={4}>
          {error}
        </Text>
      )}
    </form>
  );
};

export default LoginForm;
