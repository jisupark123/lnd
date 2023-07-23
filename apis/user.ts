import AppResponseType from '@/types/appResponseType';
import { AuthorityName, LoginFrom } from '@prisma/client';
import axios from 'axios';

export interface UserResponseType {
  id: number;
  createdAt: string;
  authorities: AuthorityName[];
  nickname: string;
  profileImage: string | null;
  loginFrom: LoginFrom;
  levelScore: number;
}

export const fetchUser = async () => {
  const response = await axios.get<AppResponseType<UserResponseType>>('/api/user/me');
  return response;
};
