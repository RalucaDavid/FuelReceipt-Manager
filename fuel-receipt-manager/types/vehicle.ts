export interface VehicleRequestDTO {
  licensePlate: string;
  brand: string;
  model: string;
  year: number | null;
  vin: string;
}

export interface VehicleResponseDTO {
  id: string;
  licensePlate: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  vin: string | null;
}
