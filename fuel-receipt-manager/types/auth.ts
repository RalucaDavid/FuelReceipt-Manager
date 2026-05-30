export type Role = "COMPANY" | "ACCOUNTANT";

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
