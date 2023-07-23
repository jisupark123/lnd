import { UserResponseType, fetchUser } from '@/apis/user';
import AppResponseType from '@/types/appResponseType';
import { LoginFrom } from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { QueryOptions, useQuery } from 'react-query';

type ResponseType = AppResponseType<UserResponseType>;

export const USE_USER_QUERY_KEY = 'USE_USER_QUERY_KEY';

export function useUserQuery(options?: QueryOptions<AxiosResponse<ResponseType>, AxiosError>) {
  const { data, isLoading, isError } = useQuery<AxiosResponse<ResponseType>, AxiosError>(
    USE_USER_QUERY_KEY,
    fetchUser,
    {
      ...options,
      retry: 0,
      refetchOnWindowFocus: false, // 다른 창 갔다가 돌아올 경우 다시 요청할지
    },
  );
  return { user: data?.data.result, isLoading, isError };
}
