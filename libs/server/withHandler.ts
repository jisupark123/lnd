import AppResponseType from '@/types/appResponseType';
import { NextApiRequest, NextApiResponse } from 'next';
import { JwtPayloadType } from '@/types/jwtPayloadType';
import client from './prismaClient';
import makeJwtToken from './makeJwtToken';
import { JWT_ACCESS_TOKEN_EXPIRES_IN } from '../domain/jwt';
import verifyJwtOrNull from './verifyJwtOrNull';
import cookie from './cookie';
import verifyUser from './verifyUser';

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ConfigType {
  methods: MethodType[];
  privateMethods?: MethodType[];
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
}

/**
 * 올바른 method인지 확인하고, try,catch 같은 진부한 코드를 처리한다.
 * @param methods 'GET' | 'POST' | 'PUT' | 'DELETE'
 * @param handler (req: NextApiRequest, res: NextApiResponse) => void
 */
function withHandler({ methods, privateMethods, handler }: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse<AppResponseType>): Promise<any> {
    // 잘못된 타입의 요청이 들어오면 종료
    // if (req.method && !methods.includes(req.method as any)) {
    if (!methods.includes(req.method as MethodType)) {
      return res.status(405).json({ isSuccess: false, message: '잘못된 요청 메소드', result: {} });
    }

    // AccessToken, RefreshToken 검사
    // 1. AccessToken 유효 -> 통과
    // 2. AccessToken 만료
    // 2-1. RefreshToken 유효 -> 새로운 AccessToken 재발급, 통과
    // 2-2. RefreshToken 만료 -> 401 반환

    if (privateMethods?.includes(req.method as MethodType)) {
      const { verified, userId, authorities } = await verifyUser(req, res);
      if (verified) {
        req.headers.userId = String(userId!);
        req.headers.authorities = authorities;
      } else {
        return res.status(401).json({
          isSuccess: false,
          message: '유효하지 않거나 만료된 jwt 토큰입니다',
          result: {},
        });
      }
    }

    // handler 실행
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ isSuccess: false, message: String(error), result: {} });
    }
  };
}

export default withHandler;
