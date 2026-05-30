import useSWR from "swr";
import { ReceiptResponseDTO } from "@/types/receipts";
import { getReceiptsByVehicleURL } from "@/api/receipts";
import { fetcher } from "@/utils/fetcher";

const useVehicleReceipts = (vehicleId: string) => {
  const { data, error, isLoading, mutate } = useSWR<ReceiptResponseDTO[]>(
    getReceiptsByVehicleURL(vehicleId),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { receipts: data, isLoading, isError: error, mutate };
};

export default useVehicleReceipts;
