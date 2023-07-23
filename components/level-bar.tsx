import { Level, levelFromLevelScore } from '@/libs/domain/level';
import { cls } from '@/libs/client/cls';
import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  levelScore: number;
}

const LevelBar: React.FC<Props> = ({ levelScore, ...props }) => {
  const { level, grade } = levelFromLevelScore(levelScore);
  return (
    <div className={cls('bg-bg_1 rounded-full overflow-hidden', props.className ?? '')}>
      <div className={`bg-${level}`} style={{ width: `${grade * 20}%`, height: '100%' }} />
    </div>
  );
};

export default LevelBar;
