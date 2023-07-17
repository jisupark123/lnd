export type JwtExpiresInType = '2d' | '14d';

export const JWT_ACCESS_TOKEN_EXPIRES_IN_NUMBER = 60 * 60 * 24 * 2; // access token 만료 기간 (시간)
export const JWT_REFRESH_TOKEN_EXPIRES_IN_NUMBER = 60 * 60 * 24 * 14; // refresh token 만료 기간 (시간)

export const JWT_ACCESS_TOKEN_EXPIRES_IN: JwtExpiresInType = '2d'; // access token 만료 기간
export const JWT_REFRESH_TOKEN_EXPIRES_IN: JwtExpiresInType = '14d'; // refresh token 만료 기간

export const JWT_ACCESS_TOKEN_COOKIE_KEY = 'accessToken';
export const JWT_REFRESH_TOKEN_COOKIE_KEY = 'refreshToken';
