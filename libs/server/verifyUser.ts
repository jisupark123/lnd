import { NextApiRequest, NextApiResponse } from 'next';
import verifyJwtOrNull from './verifyJwtOrNull';
import { JwtPayloadType } from '@/types/jwtPayloadType';
import client from './prismaClient';
import makeJwtToken from './makeJwtToken';
import { JWT_ACCESS_TOKEN_EXPIRES_IN } from '../domain/jwt';
import cookie from './cookie';
import { AuthorityName } from '@prisma/client';

// cookie에 저장된 accessToken으로 유저를 인증하고 userId를 반환하는 함수
// accessToken이 만료되어서 새로운 토큰을 생성할 경우 쿠키에 저장한다.
export default async function verifyUser(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{
  verified: boolean;
  userId: number | null;
  authorities: AuthorityName[];
}> {
  const { accessToken, refreshToken } = req.cookies;

  const decodedAccessToken = typeof accessToken === 'string' ? verifyJwtOrNull<JwtPayloadType>(accessToken) : null;

  // AccessToken 유효
  if (decodedAccessToken) {
    const { userId, authorities } = decodedAccessToken;
    return { verified: true, userId, authorities };

    // AccessToken 만료
  } else {
    // verify & db에서 값 비교 두가지를 동시에 진행
    const decodedRefreshToken =
      typeof refreshToken === 'string' ? verifyJwtOrNull<JwtPayloadType>(refreshToken as string) : null;
    const isRefreshTokenValid =
      decodedRefreshToken &&
      refreshToken === (await client.refreshToken.findUnique({ where: { userId: decodedRefreshToken.userId } }))?.token;

    // RefreshToken 유효
    if (isRefreshTokenValid) {
      const { userId, authorities } = decodedRefreshToken;
      const newAccessToken = makeJwtToken({ userId, authorities }, JWT_ACCESS_TOKEN_EXPIRES_IN);
      cookie.setAccessToken(req, res, newAccessToken);
      return { verified: true, userId, authorities };
      // RefreshToken 만료
    } else {
      return { verified: false, userId: null, authorities: [] };
    }
  }
}
