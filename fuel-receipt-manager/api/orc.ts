import { ErrorResponse } from "@/types/error";
import { OcrResponseDTO } from "@/types/receipts";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function scanReceipt(file: File): Promise<OcrResponseDTO> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/ocr/scan`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response
      .json()
      .catch(() => ({ message: "Scan failed" }));
    throw new Error(errorData.message);
  }
  return response.json();
}
