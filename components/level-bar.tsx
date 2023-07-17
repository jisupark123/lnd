import { Level, levelFromLevelScore } from '@/libs/domain/level';
import { cls } from '@/libs/client/cls';
import React from 'react';

interface Props {
  width: number;
  height: number;
  levelScore: number;
}

const LevelBar: React.FC<Props> = ({ width, height, levelScore }) => {
  const { level, grade } = levelFromLevelScore(levelScore);
  return (
    <div className='bg-bg_1 rounded-full overflow-hidden' style={{ width: `${width}px`, height: `${height}px` }}>
      <div className={`bg-${level}`} style={{ width: `${grade * 20}%`, height: '100%' }} />
    </div>
  );
};

export default LevelBar;
