import { NextApiRequest, NextApiResponse } from 'next';
import AppResponseType from '@/types/appResponseType';
import withHandler from '@/libs/server/withHandler';
import { Level, levelToLevelScore } from '@/libs/domain/level';
import { ProblemFormat, ProblemOrderType, ProblemResult, ProblemType } from '@/types/problem';
import client from '@/libs/server/prismaClient';
import { ProblemResponseType } from '@/query/problems/useProblemsQuery';
import verifyUser from '@/libs/server/verifyUser';
import { Pagination } from '@/types/pagination';

export type PostProblemReqBody = {
  level: Level;
  type: ProblemType;
  result: ProblemResult;
  hint: string | null;
  format: ProblemFormat;
};

export type ProblemFilterParams = {
  page?: string;
  levels?: Level | Level[];
  types?: ProblemType[];
  status: 'unsolved' | undefined;
  order?: ProblemOrderType; // 최신순 | 정답률 높은 문제 | 정답률 낮은 문제
};

const PROBLEM_SLICE = 50; // 한 페이지에 ?개 문제
const PAGE_SLICE = 5; // 페이지 버튼 ?개

async function handler(req: NextApiRequest, res: NextApiResponse<AppResponseType>) {
  if (req.method === 'GET') {
    const { verified, userId } = await verifyUser(req, res);
    const { page, levels, types, status, order } = req.query as ProblemFilterParams;
    const currentPage = page ? Number(page) : 1;
    const initLevels = typeof levels === 'string' ? [levels] : levels;
    const initTypes = typeof types === 'string' ? [types] : types;
    const problems = await client.problem.findMany({
      select: { id: true, level: true, levelScore: true, createdUser: true, createdAt: true, attempts: true },
      // include: { attempts: true },
      where: {
        // type에 맞는 문제만 필터링
        ...(initTypes
          ? {
              OR: initTypes.map((type) => ({ type })),
            }
          : {}),

        // level에 맞는 문제만 필터링
        ...(initLevels
          ? {
              OR: initLevels.map((level) => ({ level })),
            }
          : {}),

        // 유저가 풀지 않은 문제를 필터링
        // solved가 true에 해당하는 문제는 모두 제외하고
        // solved가 false인 문제만 선택
        // ...(status === 'unsolved' && verified
        //   ? {
        //       NOT: {
        //         attempts: {
        //           some: {
        //             AND: [
        //               { userId: Number(userId), solved: true },
        //               { problem: { createdUser: { id: Number(userId) } } },
        //             ],
        //           },
        //         },
        //       },
        //       attempts: {
        //         some: {
        //           AND: [
        //             { userId: Number(userId), solved: false },
        //             { problem: { createdUser: { id: Number(userId) } } },
        //           ],
        //         },
        //       },
        //     }
        //   : {}),
      },
      orderBy: { createdAt: 'desc' },
      // take: PROBLEM_SLICE,
      // skip: PROBLEM_SLICE * currentPage - PROBLEM_SLICE,
    });

    // Pagination 구하기
    const pageCount = Math.floor((problems.length - 1) / PROBLEM_SLICE) + 1; // 총 페이지 수
    const startPage = Math.floor((currentPage - 1) / PAGE_SLICE) * PAGE_SLICE + 1; // 버튼바 시작 페이지
    const lastPage = startPage + PROBLEM_SLICE - 1 < pageCount ? startPage + PROBLEM_SLICE - 1 : pageCount; // 버튼바 마지막 페이지

    const pagination: Pagination = {
      currentPage,
      pageCount,
      startPage,
      lastPage,
    };

    const processedProblems = problems.map((problem) => {
      const { id, level, levelScore, createdAt, createdUser, attempts } = problem;
      const answerCount = attempts.filter((attempt) => attempt.solved === true).length; // 풀이자 수
      const answerRate = answerCount === 0 ? 0 : Number(((answerCount / attempts.length) * 100).toFixed(1)); // 정답률
      const userSolved = !!attempts.find((attempt) => attempt.solved && attempt.userId === userId);
      return {
        id,
        level,
        levelScore,
        createdAt,
        createdUserId: createdUser ? createdUser.id : null,
        createdUserProfile: createdUser ? createdUser.profileImage : null,
        answerCount,
        answerRate,
        userSolved,
      };
    });

    const filteredResponse =
      verified && status === 'unsolved'
        ? processedProblems.filter((problem) => !problem.userSolved)
        : processedProblems;

    const sortedResponse =
      order === 'acceptance_desc' // 정답률 높은 순
        ? filteredResponse.sort((a, b) => b.answerRate - a.answerRate)
        : order === 'acceptance_asc' // 정답률 낮은 순
        ? filteredResponse.sort((a, b) => a.answerRate - b.answerRate)
        : filteredResponse; // 최신순 (DB에서 정렬)

    const slicedResponse = sortedResponse.slice(PROBLEM_SLICE * currentPage - PROBLEM_SLICE, PROBLEM_SLICE);
    const lastResponse = slicedResponse.map((res) => ({ ...res, answerRate: `${res.answerRate}%` }));

    return res
      .status(200)
      .json({ isSuccess: true, message: '성공적으로 불러왔습니다.', result: { problems: lastResponse, pagination } });
  }
  if (req.method === 'POST') {
    const { userId } = req.headers;
    const { level, type, result, hint, format }: PostProblemReqBody = req.body;

    await client.problem.create({
      data: {
        userId: Number(userId),
        level,
        levelScore: levelToLevelScore(level),
        type,
        result,
        hint,
        format: format as any,
      },
    });
    return res.status(200).json({ isSuccess: true, message: '성공적으로 저장되었습니다.', result: {} });
  }
}

export default withHandler({ methods: ['GET', 'POST'], privateMethods: ['POST'], handler });
