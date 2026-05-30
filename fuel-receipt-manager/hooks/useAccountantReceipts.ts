import useSWR from "swr";
import { ReceiptResponseDTO } from "@/types/receipts";
import { getClientReceiptsURL } from "@/api/clients";
import { fetcher } from "@/utils/fetcher";
import useClients from "./useClients";

const useAccountantReceipts = () => {
  const { clients, isLoading: clientsLoading } = useClients();

  const { data, isLoading: receiptsLoading } = useSWR<ReceiptResponseDTO[]>(
    clients ? ["accountant-all-receipts", clients.map((c) => c.id).join(",")] : null,
    async () => {
      const results: ReceiptResponseDTO[][] = await Promise.all(
        clients!.map((c) => fetcher(getClientReceiptsURL(c.id)))
      );
      return results.flat();
    },
    { revalidateOnFocus: false }
  );

  return {
    receipts: data,
    clients,
    isLoading: clientsLoading || (!!clients && receiptsLoading),
  };
};

export default useAccountantReceipts;
