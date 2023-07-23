import { USE_USER_QUERY_KEY, useUserQuery } from '@/query/user/useUserQuery';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import NotificationIcon from '../../public/icons/notification.svg';
import ProfileIcon from '../../public/icons/profile.svg';
import DropDownOptions, { DropDownMenuOption } from '../menu/dropDownMenu';
import { fetchLogout } from '@/apis/logout';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

const LOGIN_URL_REGEX = /^\/login/;

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading, isError: isUserError } = useUserQuery();
  const [showProfileIconMenu, setShowProfileIconMenu] = useState(false);
  const profileIconMenuOptions: DropDownMenuOption[] = [
    {
      content: '로그아웃',
      selectHandler: async () => {
        const response = await fetchLogout();
        if (response.status === 200) {
          setShowProfileIconMenu(false);
          queryClient.invalidateQueries(USE_USER_QUERY_KEY);
          router.reload();
        }
      },
    },
  ];
  return (
    <div className='fixed w-full h-70 flex justify-center px-0 bg-white md:px-80 z-header'>
      <div className='flex justify-between items-center w-full px-20'>
        <Link href={'/'} className=' relative w-120 h-24 md:w-150 md:h-30 lg:w-180 lg:h-36'>
          <Image src={'/imgs/logo_2.png'} alt='logo' layout='fill' objectFit='cover' />
        </Link>
        {user && (
          <div className='flex justify-center items-center gap-20'>
            <button>
              <NotificationIcon width='28' height='28' />
            </button>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileIconMenu((prev) => !prev);
                }}
              >
                <ProfileIcon width='28' height='28' />
              </button>
              {showProfileIconMenu && (
                <div className='relative'>
                  <DropDownOptions
                    className='top-10 right-0 w-192'
                    options={profileIconMenuOptions}
                    closeDropDown={() => setShowProfileIconMenu(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {!isUserLoading && !user && !LOGIN_URL_REGEX.test(router.pathname) && (
          <Link
            href={'/login'}
            className=' text-14 font-semibold bg-primary py-6 px-12 rounded-5 text-white md:text-16'
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
