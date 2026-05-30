import useSWR from "swr";
import { ReceiptResponseDTO } from "@/types/receipts";
import { getClientReceiptsURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";

const useClientReceipts = (clientId: string) => {
  const { data, error, isLoading } = useSWR<ReceiptResponseDTO[]>(
    getClientReceiptsURL(clientId),
    fetcher,
    { revalidateOnFocus: false },
  );

  return { receipts: data, isLoading, isError: error };
};

export default useClientReceipts;
