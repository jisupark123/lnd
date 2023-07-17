import { fetchLoginRequestToServer } from '@/apis/login/kakao';
import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const KakaoCallback: NextPage = () => {
  const router = useRouter();
  const { code, error } = router.query;

  if (typeof code === 'string') {
    (async () => {
      const response = await fetchLoginRequestToServer(code);
      if (response.status === 200) {
        router.push('/');
      }
    })();
  } else {
    // 에러 처리
  }

  return <div></div>;
};

export default KakaoCallback;
