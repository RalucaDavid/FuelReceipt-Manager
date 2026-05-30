import useSWR from "swr";
import { VehicleResponseDTO } from "@/types/vehicle";
import { getMyVehiclesURL } from "@/api/vehicles";
import { fetcher } from "@/utils/fetcher";

const useVehicles = () => {
  const { data, error, isLoading, mutate } = useSWR<VehicleResponseDTO[]>(
    getMyVehiclesURL(),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { vehicles: data, isLoading, isError: error, mutate };
};

export default useVehicles;
