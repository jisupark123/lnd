import client from '@/libs/server/prismaClient';
import withHandler from '@/libs/server/withHandler';
import AppResponseType from '@/types/appResponseType';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  const { id } = req.query;
  const { userId } = req.headers;
  const { solved } = req.body;

  await client.attempt.create({ data: { problemId: Number(id), userId: Number(userId), solved } });

  return res.json({ isSuccess: true, message: '성공적으로 저장되었습니다.', result: {} });
}

export default withHandler({ methods: ['POST'], privateMethods: ['POST'], handler });
