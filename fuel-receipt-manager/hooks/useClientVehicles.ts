import useSWR from "swr";
import { VehicleResponseDTO } from "@/types/vehicle";
import { getClientVehiclesURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";

const useClientVehicles = (clientId: string | null) => {
  const { data, error, isLoading } = useSWR<VehicleResponseDTO[]>(
    clientId ? getClientVehiclesURL(clientId) : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  return { vehicles: data, isLoading, isError: error };
};

export default useClientVehicles;
