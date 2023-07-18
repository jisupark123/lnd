import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ModalView: React.FC<Props> = ({ children, ...props }) => {
  // 모달 클릭 시 백드롭에도 터치 이벤트가 전파되는 것을 막기 위함
  const handleClickModalView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };
  return (
    <div className=' z-modal_component fixed top-0 left-0 w-screen h-screen flex justify-center items-center'>
      <div onClick={handleClickModalView} className={props.className ?? ''}>
        {children}
      </div>
    </div>
  );
};

export default ModalView;
