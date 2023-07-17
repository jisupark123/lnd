import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';

declare global {
  interface Window {
    Kakao: {
      init: (key: any) => void;
      Auth: {
        authorize: (options: { redirectUri: string }) => void;
      };
    };
  }
}

export default function App({ Component, pageProps }: AppProps) {
  // next.js는 페이지 전환마다 _app.tsx가 렌더링되므로 queryClient가 재선언되지 않게 useState로 관리
  const [queryClient] = useState(() => new QueryClient());
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Script
          src='https://developers.kakao.com/sdk/js/kakao.js'
          onLoad={() => {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
          }}
        ></Script>
        <Component {...pageProps} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
