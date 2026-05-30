import useSWR from "swr";
import { VehicleResponseDTO } from "@/types/vehicle";
import { getClientVehiclesURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";

const useClientVehicles = (clientId: string) => {
  const { data, error, isLoading } = useSWR<VehicleResponseDTO[]>(
    getClientVehiclesURL(clientId),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { vehicles: data, isLoading, isError: error };
};

export default useClientVehicles;
