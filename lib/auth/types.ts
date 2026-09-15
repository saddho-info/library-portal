export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  publisherId: string | null;
  libraryId: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: "Bearer";
  user: PublicUser;
};
