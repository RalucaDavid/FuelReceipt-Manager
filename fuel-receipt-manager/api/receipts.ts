import { ReceiptRequestDTO, ReceiptResponseDTO } from "@/types/receipts";
import { ErrorResponse } from "@/types/error";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllReceiptsURL = () => `${BASE_URL}/receipts/get-all`;

export async function getReceiptById(id: string): Promise<ReceiptResponseDTO> {
  const response = await fetch(`${BASE_URL}/receipts/get/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response
      .json()
      .catch(() => ({ message: "Receipt not found" }));
    throw new Error(errorData.message);
  }
  return response.json();
}

export async function createReceipt(data: ReceiptRequestDTO): Promise<void> {
  const response = await fetch(`${BASE_URL}/receipts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response
      .json()
      .catch(() => ({ message: "Could not create receipt" }));
    throw new Error(errorData.message);
  }
}

export async function updateReceipt(
  id: string,
  data: ReceiptRequestDTO,
): Promise<void> {
  const response = await fetch(`${BASE_URL}/receipts/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response
      .json()
      .catch(() => ({ message: "Update failed" }));
    throw new Error(errorData.message);
  }
}

export async function deleteReceipt(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/receipts/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response
      .json()
      .catch(() => ({ message: "Delete failed" }));
    throw new Error(errorData.message);
  }
}
