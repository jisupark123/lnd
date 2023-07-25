import React from 'react';
import Header from './header';
import HeadMeta, { HeadMetaProps } from './headMeta';

interface Props extends HeadMetaProps {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ metaTitle, metaDescription, children }) => {
  return (
    <div>
      <HeadMeta {...{ metaTitle, metaDescription }} />
      <Header />
      <div className='pt-70'>{children}</div>
    </div>
  );
};

export default Layout;
