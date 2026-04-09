export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const ACCESS_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export type AccessTokenPayload = {
  userId: number;
  role: 'USER' | 'ADMIN';
};
