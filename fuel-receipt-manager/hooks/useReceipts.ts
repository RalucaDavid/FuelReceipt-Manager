import { getAllReceiptsURL } from "@/api/receipts";
import { ReceiptResponseDTO } from "@/types/receipts";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

const useReceipts = () => {
  const { data, error, isLoading, mutate } = useSWR<ReceiptResponseDTO[]>(
    getAllReceiptsURL(),
    fetcher,
  );

  return {
    allReceipts: data,
    isLoading: isLoading || !data,
    isError: error,
    mutate,
  };
};

export default useReceipts;
