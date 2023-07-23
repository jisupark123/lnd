import { fetchLoginRequestToServer } from '@/apis/login/kakao';
import Layout from '@/components/layout/layout';
import { USE_USER_QUERY_KEY } from '@/query/user/useUserQuery';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';

const KakaoCallback: NextPage = () => {
  const router = useRouter();
  const { code, error } = router.query;
  const queryClient = useQueryClient();

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

  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default KakaoCallback;
