import useSWR from "swr";
import { UserResponseDTO } from "@/types/auth";
import { getCurrentUserURL } from "@/api/auth";
import { fetcher } from "@/utils/fetcher";

const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR<UserResponseDTO | null>(
    getCurrentUserURL(),
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    },
  );

  return {
    user: data,
    isLoading: isLoading || !data,
    isError: error,
    mutate,
  };
};

export default useUser;
