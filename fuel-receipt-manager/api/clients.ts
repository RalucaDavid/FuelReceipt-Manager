import { ReceiptRequestDTO } from "@/types/receipts";
import { ErrorResponse } from "@/types/error";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyClientsURL = () => `${BASE_URL}/clients`;
export const getClientVehiclesURL = (clientId: string) =>
  `${BASE_URL}/clients/${clientId}/vehicles`;
export const getClientVehicleReceiptsURL = (clientId: string, vehicleId: string) =>
  `${BASE_URL}/clients/${clientId}/vehicles/${vehicleId}/receipts`;
export const getClientReceiptsURL = (clientId: string) =>
  `${BASE_URL}/clients/${clientId}/receipts`;
export const getMyAccountantsURL = () => `${BASE_URL}/clients/accountants`;

export async function inviteAccountant(accountantEmail: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/clients/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountantEmail }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
}

export async function removeClient(clientId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/clients/${clientId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
}

export async function removeAccountant(accountantId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/clients/accountants/${accountantId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
}

export async function createReceiptForClient(clientId: string, data: ReceiptRequestDTO): Promise<void> {
  const response = await fetch(`${BASE_URL}/clients/${clientId}/receipts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({ message: "Could not create receipt" }));
    throw new Error(errorData.message);
  }
}

export async function updateReceiptForClient(clientId: string, receiptId: string, data: ReceiptRequestDTO): Promise<void> {
  const response = await fetch(`${BASE_URL}/clients/${clientId}/receipts/${receiptId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({ message: "Update failed" }));
    throw new Error(errorData.message);
  }
}

export async function deleteReceiptForClient(clientId: string, receiptId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/clients/${clientId}/receipts/${receiptId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({ message: "Delete failed" }));
    throw new Error(errorData.message);
  }
}
