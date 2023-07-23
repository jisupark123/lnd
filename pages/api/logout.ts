import { JWT_ACCESS_TOKEN_COOKIE_KEY, JWT_REFRESH_TOKEN_COOKIE_KEY } from '@/libs/domain/jwt';
import withHandler from '@/libs/server/withHandler';
import AppResponseType from '@/types/appResponseType';
import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  const { userId } = req.headers;
  deleteCookie(JWT_ACCESS_TOKEN_COOKIE_KEY, { req, res });
  deleteCookie(JWT_REFRESH_TOKEN_COOKIE_KEY, { req, res });

  return res.json({ isSuccess: true, message: '로그아웃 되었습니다.', result: {} });
}

export default withHandler({ methods: ['POST'], privateMethods: ['POST'], handler });
