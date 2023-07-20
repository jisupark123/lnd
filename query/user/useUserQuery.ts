import AppResponseType from '@/types/appResponseType';
import { LoginFrom } from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { QueryOptions, useQuery } from 'react-query';

interface UserResponseType {
  id: number;
  createdAt: string;
  email: string;
  nickname: string;
  profileImage: string | null;
  loginFrom: LoginFrom;
  levelScore: number;
}

type ResponseType = AppResponseType<UserResponseType>;

const fetchUser = async () => {
  const response = await axios.get<ResponseType>('/api/user/me');
  return response;
};

export function useUserQuery(options?: QueryOptions<AxiosResponse<ResponseType>, AxiosError>) {
  const { data, isLoading, isError } = useQuery<AxiosResponse<ResponseType>, AxiosError>('useUserQuery', fetchUser, {
    ...options,
    retry: 1,
    refetchOnWindowFocus: false, // 다른 창 갔다가 돌아올 경우 다시 요청할지
  });
  return { user: data?.data.result, isLoading, isError };
}
