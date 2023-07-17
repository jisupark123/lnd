import { NextPage } from 'next';
import React from 'react';

const Login: NextPage = () => {
  const handleKakaoLogin = () => {
    window.Kakao.Auth.authorize({ redirectUri: 'http://localhost:3000/login/kakao-callback' });
  };
  return (
    <div className='flex justify-center items-center text-30 h-screen'>
      <button onClick={handleKakaoLogin}>Kakao Login</button>
    </div>
  );
};

export default Login;
