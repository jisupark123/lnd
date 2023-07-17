import React from 'react';

const DeleteBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className='p-5 border-2 border-solid border-danger rounded-full'>
      <div className=' w-10 h-2 bg-danger' />
    </button>
  );
};

export default DeleteBtn;
