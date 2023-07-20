import AppResponseType from '@/types/appResponseType';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

export interface ProblemResponseType {
  id: number;
  levelScore: number;
  correctAnswerRate: string;
  answerCount: number;
  createdUserId: number;
  createdUserProfile: string | null;
}

type ResponseType = AppResponseType<ProblemResponseType>;

const fetchProblems = async () => {
  return await axios.get<ResponseType>('/api/problems');
};

export function useProblemsQuery(options?: UseQueryOptions<AxiosResponse<ResponseType>, AxiosError>) {
  useQuery;
  const { data, isLoading, isError } = useQuery<AxiosResponse<ResponseType>, AxiosError>(
    'useProblemsQuery',
    fetchProblems,

    {
      ...options,
      retry: 1,
      refetchOnWindowFocus: false, // 다른 창 갔다가 돌아올 경우 다시 요청할지
    },
  );
  return { problems: data?.data.result, isLoading, isError };
}
