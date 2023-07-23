import client from '@/libs/server/prismaClient';
import verifyUser from '@/libs/server/verifyUser';
import withHandler from '@/libs/server/withHandler';
import { isNumeric } from '@/libs/utils/isNumeric';
import AppResponseType from '@/types/appResponseType';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  const { id } = req.query;
  if (!isNumeric(id as string)) {
    return res.status(400).json({ isSuccess: false, message: '잘못된 타입의 id가 요청됨', result: {} });
  }
  const { verified, userId } = await verifyUser(req, res);

  const problem = await client.problem.findUnique({
    where: { id: Number(id) },
    include: { attempts: true, createdUser: true },
  });

  if (!problem) {
    return res.status(404).json({
      isSuccess: false,
      message: '해당 문제를 찾을 수 없습니다.',
      result: {},
    });
  }
  const answerCount = problem.attempts.filter((attempt) => attempt.solved).length; // 정답자 수
  const response = {
    id: problem.id,
    level: problem.level,
    levelScore: problem.levelScore,
    result: problem.result,
    type: problem.type,
    hint: problem.hint,
    attemptCount: problem.attempts.length,
    answerRate: answerCount ? `${((answerCount / problem.attempts.length) * 100).toFixed(1)}%` : '0.0%',
    answerCount: problem.attempts.filter((attempt) => attempt.solved).length,
    userSolved: !!problem.attempts.find((attempt) => attempt.userId === userId && attempt.solved),
    createdUserNickname: problem.createdUser?.nickname ?? null,
    createdUserProfile: problem.createdUser?.profileImage ?? null,
    format: problem.format,
  };

  return res.json({ isSuccess: true, message: '성공적으로 조회되었습니다.', result: { ...response } });
}

export default withHandler({ methods: ['GET'], handler });
