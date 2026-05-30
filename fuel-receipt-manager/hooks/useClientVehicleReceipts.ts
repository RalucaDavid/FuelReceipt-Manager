import useSWR from "swr";
import { ReceiptResponseDTO } from "@/types/receipts";
import { getClientVehicleReceiptsURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";

const useClientVehicleReceipts = (clientId: string, vehicleId: string) => {
  const { data, error, isLoading } = useSWR<ReceiptResponseDTO[]>(
    getClientVehicleReceiptsURL(clientId, vehicleId),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { receipts: data, isLoading, isError: error };
};

export default useClientVehicleReceipts;
