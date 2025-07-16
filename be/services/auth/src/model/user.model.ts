export interface User {
  id: number;
  email: string;
  name?: string | null;
  password?: string | null;
  resetPassToken?: string | null;
  resetPassTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
