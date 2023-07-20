import { useUserQuery } from '@/query/user/useUserQuery';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => {
  const { user, isError: isUserError } = useUserQuery();
  return (
    <div className='fixed w-full h-70 flex justify-center px-0 bg-white md:px-80 z-header'>
      <div className='flex justify-between items-center w-full px-20'>
        <Link href={'/'}>
          <Image src={'/imgs/logo_2.png'} alt='logo' width={180} height={36} />
        </Link>
        {user && (
          <div className='flex justify-center items-center gap-20'>
            <button>
              <Image src={'/icons/notification.svg'} alt='알림' width={30} height={0} />
            </button>
            <button>
              <Image src={'/icons/profile.svg'} alt='프로필 이미지' width={30} height={0} />
            </button>
          </div>
        )}
        {isUserError && (
          <Link href={'/login'} className=' text-18 font-semibold'>
            로그인
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
