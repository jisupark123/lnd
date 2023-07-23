import Layout from '@/components/layout/layout';
import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import KakaoBubbleIcon from '../../public/icons/kakao-bubble.svg';
import { KAKAO_REDIRECT_URI_DEPLOY, KAKAO_REDIRECT_URI_DEVELOPMENT } from '@/constants/redirectUri';

const Login: NextPage = () => {
  const handleKakaoLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: process.env.NODE_ENV === 'development' ? KAKAO_REDIRECT_URI_DEVELOPMENT : KAKAO_REDIRECT_URI_DEPLOY,
    });
  };
  return (
    <Layout>
      <main className='h-[calc(100vh-70px)] px-20 flex justify-center items-center'>
        <div className='w-full flex flex-col items-center pt-50 pb-80 px-50 bg-white rounded-8 max-w-400'>
          <div className='relative w-100 h-78 mb-20 md:w-120 md:h-90 lg:w-130 lg:h-102'>
            <Image src={'/imgs/logo_1.png'} alt='로고 이미지' layout='fill' objectFit='cover' />
          </div>
          <div className='w-full h-1 mb-10 bg-bg_1' />
          <span className='text-10 text-gray mb-50 md:text-12'>Social Login</span>
          <button
            onClick={handleKakaoLogin}
            className='flex justify-between items-center w-full py-10 px-15 bg-[#FEE501] rounded-12'
          >
            <KakaoBubbleIcon width='20' />
            <span className='text-16 text-black font-normal'>카카오 로그인</span>
            <div />
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default Login;
