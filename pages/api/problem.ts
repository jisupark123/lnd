import { NextApiRequest, NextApiResponse } from 'next';
import AppResponseType from '@/types/appResponseType';
import withHandler from '@/libs/server/withHandler';
import { Level, levelToLevelScore } from '@/libs/domain/level';
import { ProblemFormat, ProblemResult, ProblemType } from '@/types/problem';
import client from '@/libs/server/prismaClient';

export type PostProblemReqBody = {
  level: Level;
  type: ProblemType;
  result: ProblemResult;
  hint: string | null;
  format: ProblemFormat;
};

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  if (req.method === 'POST') {
    const { userId } = req.headers;
    const { level, type, result, hint, format }: PostProblemReqBody = req.body;

    await client.problem.create({
      data: {
        userId: Number(userId),
        levelScore: levelToLevelScore(level),
        type,
        result,
        hint,
        format: format as any,
      },
    });
  }
  return res.status(200).json({ isSuccess: true, message: '성공적으로 저장되었습니다.', result: {} });
}

export default withHandler({ methods: ['POST'], privateMethods: ['POST'], handler });
