import { fetchLoginRequestToServer } from '@/apis/login/kakao';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const KakaoCallback: NextPage = () => {
  const router = useRouter();
  const { code, error } = router.query;

  useEffect(() => {
    if (typeof code === 'string') {
      (async () => {
        const response = await fetchLoginRequestToServer(code); // 서버에 로그인 요청
        if (response.status === 200) {
          router.push('/');
        }
      })();
    } else {
      // 에러 처리
    }
  });

  return <div></div>;
};

export default KakaoCallback;
