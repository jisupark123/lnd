import { setCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  JWT_ACCESS_TOKEN_COOKIE_KEY,
  JWT_ACCESS_TOKEN_EXPIRES_IN_NUMBER,
  JWT_REFRESH_TOKEN_COOKIE_KEY,
  JWT_REFRESH_TOKEN_EXPIRES_IN_NUMBER,
} from '../domain/jwt';

const cookie = {
  setAccessToken: (req: NextApiRequest, res: NextApiResponse, token: string) => {
    setCookie(JWT_ACCESS_TOKEN_COOKIE_KEY, token, {
      req,
      res,
      maxAge: JWT_ACCESS_TOKEN_EXPIRES_IN_NUMBER,
      path: '/',
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
  },
  setRefreshToken: (req: NextApiRequest, res: NextApiResponse, token: string) => {
    setCookie(JWT_REFRESH_TOKEN_COOKIE_KEY, token, {
      req,
      res,
      maxAge: JWT_REFRESH_TOKEN_EXPIRES_IN_NUMBER,
      path: '/',
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
  },
};

export default cookie;
