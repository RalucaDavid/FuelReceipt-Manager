import useSWR from "swr";
import { ClientResponseDTO } from "@/types/client";
import { getMyAccountantsURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";

const useAccountants = () => {
  const { data, error, isLoading, mutate } = useSWR<ClientResponseDTO[]>(
    getMyAccountantsURL(),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { accountants: data, isLoading, isError: error, mutate };
};

export default useAccountants;
