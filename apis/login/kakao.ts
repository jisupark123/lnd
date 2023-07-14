import { KAKAO_REDIRECT_URI_LOCAL } from '@/constants/redirectUri';
import AppResponseType from '@/types/appResponseType';
import axios from 'axios';

// 카카오에서 인가코드 받아온 후 서버에 로그인 요청
export const fetchLoginRequestToServer = async (code: string) => {
  const response = await axios.post<AppResponseType>('/api/login/kakao', null, {
    headers: {
      auth_code: code,
    },
  });
  return response;
};

// 클라이언트에게 전달받은 인가코드로 카카오 서버에 AccessToken 요청하기
export async function getAccessTokenFromKakao(authCode: string) {
  const response = await axios.post<{ access_token: string }>('https://kauth.kakao.com/oauth/token', null, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_RESTAPI_KEY,
      redirect_uri: KAKAO_REDIRECT_URI_LOCAL,
      code: authCode,
    },
  });

  return response.data.access_token;
}

interface KakaoUserInfoResponse {
  kakao_account: {
    email: string;
  };
}

// AccessToken으로 카카오 서버에서 유저의 정보를 받아오기
export async function getUserInfoFromKakao(accessToken: string) {
  const response = await axios.get<KakaoUserInfoResponse>('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
  return response.data;
}
