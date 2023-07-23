import AppResponseType from '@/types/appResponseType';
import axios from 'axios';

export const fetchNewAttempt = async (problemId: number, solved: boolean) => {
  return await axios.post<AppResponseType>(`/api/attempt/${problemId}`, { solved });
};
