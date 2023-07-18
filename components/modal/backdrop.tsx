import React, { useEffect, useState } from 'react';

interface Props {
  children?: React.ReactNode;
  onBackdropClick?: () => void;
}

const BackDrop: React.FC<Props> = ({ children, onBackdropClick }) => {
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  });
  return (
    <div
      className='fixed top-0 left-0 w-full h-full bg-backdrop z-backdrop_1 flex justify-center items-center'
      onClick={onBackdropClick}
    >
      {children ?? null}
    </div>
  );
};

export default BackDrop;
