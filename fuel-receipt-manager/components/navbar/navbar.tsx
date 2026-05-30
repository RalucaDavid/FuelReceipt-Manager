import { AppShell, Box, Group, NavLink, Stack, Title } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsBoxFill } from "react-icons/bs";
import {
  MdDashboard,
  MdPeople,
  MdManageAccounts,
  MdDirectionsCar,
} from "react-icons/md";
import { Dictionary } from "@/dictionaries";
import UserAvatar from "../user-avatar";
import useUser from "@/hooks/useUser";
import classes from "./navbar.module.css";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const pathname = usePathname();
  const { user } = useUser();
  const navData = [
    { icon: MdDashboard, label: Dictionary.dashboard, href: "/dashboard" },
    ...(user?.role === "COMPANY"
      ? [
          {
            icon: MdDirectionsCar,
            label: Dictionary.vehicles,
            href: "/vehicles",
          },
        ]
      : []),
    ...(user?.role === "ACCOUNTANT"
      ? [{ icon: MdPeople, label: Dictionary.clients, href: "/clients" }]
      : []),
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
            <Title size="lg" className={classes.logoText}>
              {Dictionary.fuelReceiptsManager}
            </Title>
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

          {user?.role === "COMPANY" && (
            <NavLink
              component={Link}
              href="/accountants"
              label={Dictionary.accountants}
              active={pathname === "/accountants"}
              leftSection={<MdManageAccounts size={20} />}
              variant="filled"
              color="blue"
              classNames={{ root: classes.navLinkRoot }}
            />
          )}
        </Stack>

        <UserAvatar />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Navbar;
