import { Paper, Title, SimpleGrid, Text, Group, Avatar, Anchor } from "@mantine/core";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";
import { ClientResponseDTO } from "@/types/client";
import { Dictionary } from "@/dictionaries";

interface ClientsOverviewProps {
  clients: ClientResponseDTO[];
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const ClientsOverview = ({ clients }: ClientsOverviewProps) => {
  return (
    <Paper p="lg" radius="md" withBorder style={{ background: "var(--color-background-main)" }}>
      <Title order={4} fw={600} mb="md" size="h4">
        {Dictionary.myClients}
      </Title>

      {clients.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {Dictionary.noClientsYet}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
          {clients.map((client) => (
            <Anchor
              key={client.id}
              component={Link}
              href={`/clients/${client.id}`}
              underline="never"
            >
              <Paper
                p="md"
                radius="md"
                withBorder
                style={{ cursor: "pointer" }}
              >
                <Group justify="space-between" align="center">
                  <Group gap="sm">
                    <Avatar color="blue" radius="xl" size="md">
                      {getInitials(client.firstName, client.lastName)}
                    </Avatar>
                    <div>
                      <Text size="sm" fw={600}>
                        {client.firstName} {client.lastName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {client.email}
                      </Text>
                    </div>
                  </Group>
                  <MdChevronRight size={18} color="var(--mantine-color-dimmed)" />
                </Group>
              </Paper>
            </Anchor>
          ))}
        </SimpleGrid>
      )}
    </Paper>
  );
};

export default ClientsOverview;
