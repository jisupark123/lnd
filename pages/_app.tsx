import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
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
  return (
    <RecoilRoot>
      <Script
        src='https://developers.kakao.com/sdk/js/kakao.js'
        onLoad={() => {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      ></Script>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
