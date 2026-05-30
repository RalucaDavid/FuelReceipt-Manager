import { VehicleRequestDTO, VehicleResponseDTO } from "@/types/vehicle";
import { ErrorResponse } from "@/types/error";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyVehiclesURL = () => `${BASE_URL}/vehicles`;

export async function createVehicle(dto: VehicleRequestDTO): Promise<VehicleResponseDTO> {
  const response = await fetch(`${BASE_URL}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}

export async function updateVehicle(id: string, dto: VehicleRequestDTO): Promise<VehicleResponseDTO> {
  const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
    credentials: "include",
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}

export async function deleteVehicle(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
}
