import useSWR from "swr";
import { ClientResponseDTO } from "@/types/client";
import { getMyClientsURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";

const useClients = () => {
  const { data, error, isLoading, mutate } = useSWR<ClientResponseDTO[]>(
    getMyClientsURL(),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { clients: data, isLoading, isError: error, mutate };
};

export default useClients;
