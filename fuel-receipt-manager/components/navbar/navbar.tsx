import { AppShell, Box, Group, NavLink, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsBoxFill } from "react-icons/bs";
import { IoReceiptSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import classes from "./navbar.module.css";
import { Dictionary } from "@/dictionaries";
import UserAvatar from "../user-avatar";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const pathname = usePathname();
  const navData = [
    { icon: MdDashboard, label: Dictionary.dashboard, href: "/dashboard" },
    {
      icon: IoReceiptSharp,
      label: Dictionary.receipts,
      href: "/receipts",
    },
  ];

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      className={classes.mainSection}
    >
      <AppShell.Navbar p="sm" className={classes.navbar}>
        <Group mb="xl">
          <Box className={classes.logoIcon}>
            <BsBoxFill color="white" size={24} />
          </Box>
          <Box>
            <Text size="lg" className={classes.logoText}>
              {Dictionary.fuelReceiptsManager}
            </Text>
          </Box>
        </Group>

        <Stack gap={4} style={{ flex: 1 }}>
          {navData.map((item) => (
            <NavLink
              key={item.label}
              component={Link}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
              leftSection={<item.icon size={20} />}
              variant="filled"
              color="blue"
              classNames={{ root: classes.navLinkRoot }}
            />
          ))}
        </Stack>

        <UserAvatar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Navbar;
