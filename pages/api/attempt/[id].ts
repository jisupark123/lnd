import client from '@/libs/server/prismaClient';
import verifyUser from '@/libs/server/verifyUser';
import withHandler from '@/libs/server/withHandler';
import AppResponseType from '@/types/appResponseType';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  const { id } = req.query;
  const { solved } = req.body;
  const { verified, userId } = await verifyUser(req, res);

  if (!verified) {
    return res.status(200).json({
      isSuccess: false,
      message: '인증되지 않은 사용자입니다. 이번 시도는 DB에 저장되지 않습니다.',
      result: {},
    });
  }

  // 이미 풀었던 사용자일 경우 DB에 저장되지 않는다.
  const alreadySolved = await client.attempt.findFirst({
    where: { AND: [{ problemId: Number(id) }, { userId: Number(userId) }, { solved }] },
  });
  if (alreadySolved) {
    return res.status(200).json({
      isSuccess: false,
      message: '이미 문제를 푼 사용자입니다. 이번 시도는 DB에 저장되지 않습니다.',
      result: {},
    });
  }

  await client.attempt.create({ data: { problemId: Number(id), userId: Number(userId), solved } });

  return res.json({ isSuccess: true, message: '성공적으로 저장되었습니다.', result: {} });
}

export default withHandler({ methods: ['POST'], handler });
