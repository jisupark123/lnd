import { NextApiRequest, NextApiResponse } from 'next';
import AppResponseType from '@/types/appResponseType';
import withHandler from '@/libs/server/withHandler';
import client from '@/libs/server/prismaClient';

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  const { userId } = req.headers;
  const user = await client.user.findUnique({ where: { id: Number(userId) } });

  return res.json({ isSuccess: true, message: '유저 정보를 성공적으로 불러왔습니다.', result: { ...user } });
}

export default withHandler({ methods: ['GET'], privateMethods: ['GET'], handler });
