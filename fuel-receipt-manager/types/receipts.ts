export type FuelType = "DIESEL" | "GASOLINE";
export type PaymentMethod = "CASH" | "CARD";

export interface ReceiptRequestDTO {
  cif: string;
  receiptNumber: string;
  fuelType: FuelType;
  paymentMethod: PaymentMethod;
  total: number;
  date: string;
}

export interface ReceiptResponseDTO extends ReceiptRequestDTO {
  id: string;
}
