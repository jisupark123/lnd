import AppResponseType from '@/types/appResponseType';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { QueryOptions, useQuery } from 'react-query';

interface UserResponseType {
  id: 3;
  createdAt: '2023-07-14T05:50:39.489Z';
  email: 'a00366@naver.com';
  nickname: 'a00366@naver.com';
  profileImage: null;
  loginFrom: 'kakao';
  levelScore: 0;
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
