import { Level } from '@/libs/domain/level';
import AppResponseType from '@/types/appResponseType';
import { ProblemFormat, ProblemResult, ProblemType } from '@/types/problem';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

type ProblemSolveResponseType = {
  id: number;
  level: Level;
  levelScore: number;
  result: ProblemResult;
  type: ProblemType;
  hint: string | null;
  attemptCount: number;
  answerRate: string;
  answerCount: number;
  userSolved: boolean;
  createdUserNickname: string | null;
  createdUserProfile: string | null;
  format: ProblemFormat;
};

type ResponseType = AppResponseType<ProblemSolveResponseType>;

const fetchProblem = async (id: string) => {
  return await axios.get(`/api/problem/${id}`);
};

export const PROBLEM_SOLVE_QUERY_KEY = 'problemSolveQuery';

export function useProblemSolveQuery(id: string, options?: UseQueryOptions<AxiosResponse<ResponseType>, AxiosError>) {
  const { data, isLoading, isError } = useQuery<AxiosResponse<ResponseType>, AxiosError>(
    [PROBLEM_SOLVE_QUERY_KEY, id],
    () => fetchProblem(id),
    {
      ...options,
      retry: 0,
      refetchOnWindowFocus: false, // 다른 창 갔다가 돌아올 경우 다시 요청할지
      staleTime: 1000 * 60 * 60 * 3, // 3시간 동안 유효한 데이터
    },
  );
  return { problem: data?.data.result, isLoading: id && isLoading, isError: id && isError };
}
