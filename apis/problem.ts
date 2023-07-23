import { ProblemFilter } from '@/pages';
import { PostProblemReqBody } from '@/pages/api/problem';
import AppResponseType from '@/types/appResponseType';
import { Pagination } from '@/types/pagination';
import { ProblemInfo } from '@/types/problem';
import axios from 'axios';

export const createNewProblem = async (problem: PostProblemReqBody) => {
  return await axios.post<AppResponseType>('/api/problem', problem);
};

interface GetProblemResponseType {
  problems: ProblemInfo[];
  pagination: Pagination;
}

export const filtersToParams = (filter: ProblemFilter) => {
  const { levels, types, order, onlyUnsolved } = filter;
  const levelsParams = `${levels.length ? levels.map((level) => `levels=${level}`).join('&') : ''}`;
  const typesParams = `${types.length ? types.map((type) => `types=${type}`).join('&') : ''}`;
  const orderParams = `order=${order}`;
  const statusParams = onlyUnsolved ? 'status=unsolved' : '';
  return [levelsParams, typesParams, orderParams, statusParams].filter((param) => param.length > 0).join('&');
};

export async function fetchProblems(params: string) {
  return await axios.get<AppResponseType<GetProblemResponseType>>(`/api/problem?${params}`);
}
