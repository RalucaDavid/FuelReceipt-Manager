import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import "./globals.css";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "Fuel Receipts Manager",
  description: "Manage your fuel receipts with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications position="top-center" zIndex={2000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
