import {
  AppShell,
  Box,
  Group,
  NavLink,
  Stack,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { BsBoxFill } from "react-icons/bs";
import { IoReceiptSharp } from "react-icons/io5";
import { MdDashboard, MdPeople, MdPersonAdd, MdManageAccounts } from "react-icons/md";
import { Dictionary } from "@/dictionaries";
import UserAvatar from "../user-avatar";
import useUser from "@/hooks/useUser";
import InviteAccountantModal from "@/components/modals/invite-accountant-modal";
import classes from "./navbar.module.css";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const pathname = usePathname();
  const { user } = useUser();
  const [inviteOpened, { open: openInvite, close: closeInvite }] = useDisclosure(false);

  const navData = [
    { icon: MdDashboard, label: Dictionary.dashboard, href: "/dashboard" },
    {
      icon: IoReceiptSharp,
      label: Dictionary.receipts,
      href: "/receipts",
    },
    ...(user?.role === "ACCOUNTANT"
      ? [{ icon: MdPeople, label: Dictionary.clients, href: "/clients" }]
      : []),
  ];

  return (
    <>
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
              <>
                <NavLink
                  component={Link}
                  href="/accountants"
                  label={Dictionary.myAccountants}
                  active={pathname === "/accountants"}
                  leftSection={<MdManageAccounts size={20} />}
                  variant="filled"
                  color="blue"
                  classNames={{ root: classes.navLinkRoot }}
                />
                <NavLink
                  label={Dictionary.inviteAccountant}
                  leftSection={<MdPersonAdd size={20} />}
                  variant="filled"
                  color="blue"
                  classNames={{ root: classes.navLinkRoot }}
                  onClick={openInvite}
                />
              </>
            )}
          </Stack>

          <UserAvatar />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>

      <InviteAccountantModal opened={inviteOpened} onClose={closeInvite} />
    </>
  );
};

export default Navbar;
