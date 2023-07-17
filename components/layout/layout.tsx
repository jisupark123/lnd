import React from 'react';
import Header from './header';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className='pt-70'>{children}</div>
    </div>
  );
};

export default Layout;
