export interface RefreshToken {
  id: number;
  userId: number;
  token: string;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
