import {
  CreateUserDTO,
  LoginRequestDTO,
  ErrorResponse,
  UserResponseDTO,
} from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: CreateUserDTO): Promise<string> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
  return response.text();
}

export async function loginUser(credentials: LoginRequestDTO): Promise<void> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Logout failed" }));
    throw new Error(errorData.message);
  }
}

export async function getCurrentUser() {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) return null;
  return response.json();
}
