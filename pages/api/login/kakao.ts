import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import AppResponseType from '@/types/appResponseType';
import client from '@/libs/server/prismaClient';
import makeJwtToken from '@/libs/server/makeJwtToken';
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN } from '@/libs/domain/jwt';
import { getAccessTokenFromKakao, getUserInfoFromKakao } from '@/apis/login/kakao';
import cookie from '@/libs/server/cookie';
import { JwtPayloadType } from '@/types/jwtPayloadType';

// DB에 존재하는 유저 가져오기
async function getExistUserFromDB(kakaoId: string) {
  return await client.user.findUnique({ where: { kakaoId }, include: { authorities: true } });
}

// 새로운 User 생성
async function createNewAccount(kakaoId: string) {
  const newUser = await client.user.create({
    data: {
      nickname: `#${kakaoId}`,
      kakaoId,
      loginFrom: 'kakao',
    },
    include: { authorities: true },
  });
  return newUser;
}

async function upsertNewRefreshToken(userId: number, token: string) {
  await client.refreshToken.upsert({
    create: {
      userId,
      token,
    },
    update: {
      token,
    },
    where: {
      userId,
    },
  });
}

// 1. 인가코드로 카카오 서버에서 Access Token 가져오기
// 2. AccessToken으로 카카오 서버에서 회원 정보 가져오기
// 3. DB에서 회원 정보 확인 (카카오 아이디)
// 4. 존재하지 않는 회원이면 새로 생성
// 5. jwt -> Access Token, Refresh Token 생성
// 6. DB에 Refresh Token upsert (생성 or 업데이트)
// 7. 쿠키에 Access Token, Refresh Token 추가

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  const { auth_code } = req.headers;

  // 인가코드로 카카오 서버에서 Access Token 가져오기
  const kakaoAccessToken = await getAccessTokenFromKakao(auth_code as string);

  // 카카오 서버에서 회원 정보 가져오기
  const { id: kakaoId } = await getUserInfoFromKakao(kakaoAccessToken);

  // DB에서 회원 정보 가져오기
  let user = await getExistUserFromDB(String(kakaoId));
  // 존재하지 않는 회원이면 새로 생성
  if (!user) {
    user = await createNewAccount(String(kakaoId));
  }

  // Access Token, Refresh Token 생성
  const jwtPayload: JwtPayloadType = {
    userId: user.id,
    authorities: user.authorities.map((autority) => autority.name),
  };
  const newAccessToken = makeJwtToken({ jwtPayload }, JWT_ACCESS_TOKEN_EXPIRES_IN);
  const newRefreshToken = makeJwtToken({ jwtPayload }, JWT_REFRESH_TOKEN_EXPIRES_IN);
  // DB에 Refresh Token upsert (생성 or 업데이트)
  await upsertNewRefreshToken(user.id, newRefreshToken);

  // 쿠키에 Access Token, Refresh Token 추가
  cookie.setAccessToken(req, res, newAccessToken);
  cookie.setRefreshToken(req, res, newRefreshToken);

  return res.status(200).json({
    isSuccess: true,
    message: '성공적으로 로그인 되었습니다',
    result: {},
  });
}

export default withHandler({ methods: ['POST'], handler });
