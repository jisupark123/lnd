import { ProblemFilter } from '@/pages';
import { ProblemFilterParams } from '@/pages/api/problem';
import { ProblemInfo } from '@/types/problem';
import AppResponseType from '@/types/appResponseType';
import { Pagination } from '@/types/pagination';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';

export interface ProblemResponseType {
  problems: ProblemInfo[];
  pagination: Pagination;
}

type ResponseType = AppResponseType<ProblemResponseType>;

const filtersToParams = (filter: ProblemFilter) => {
  const { levels, types, order, onlyUnsolved } = filter;
  const levelsParams = `${levels.length ? levels.map((level) => `levels=${level}`).join('&') : ''}`;
  const typesParams = `${types.length ? types.map((type) => `types=${type}`).join('&') : ''}`;
  const orderParams = `order=${order}`;
  const statusParams = onlyUnsolved ? 'status=unsolved' : '';
  return [levelsParams, typesParams, orderParams, statusParams].filter((param) => param.length > 0).join('&');
};

export const fetchProblems = async (params: string) => {
  return await axios.get<ResponseType>(`/api/problem?${params}`);
};

export function useProblemsQuery(
  filter: ProblemFilter,
  options?: UseQueryOptions<AxiosResponse<ResponseType>, AxiosError>,
) {
  useQuery;
  const { data, isLoading, isError } = useQuery<AxiosResponse<ResponseType>, AxiosError>(
    'useProblemsQuery',
    () => fetchProblems(filtersToParams(filter)),

    {
      ...options,
      retry: 1,
      refetchOnWindowFocus: false, // 다른 창 갔다가 돌아올 경우 다시 요청할지
    },
  );
  return { problems: data?.data.result.problems, pagination: data?.data.result.pagination, isLoading, isError };
}
