import { PostProblemReqBody } from '@/pages/api/problem';
import AppResponseType from '@/types/appResponseType';
import axios from 'axios';

export const createNewProblem = async (problem: PostProblemReqBody) => {
  return await axios.post<AppResponseType>('/api/problem', problem);
};
