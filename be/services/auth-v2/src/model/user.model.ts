export interface User {
  id: number;
  email: string;
  name?: string;
  password?: string;
  resetPassToken?: string;
  resetPassTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
