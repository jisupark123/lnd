import Layout from '@/components/layout/layout';
import CheckBoxDropDown, { CheckBoxDropDownMenu } from '@/components/menu/check-box_drop-down';
import DropDownMenu from '@/components/menu/drop-down-menu';
import ProblemEditor from '@/components/pages/problem/new/problemEditor';
import ProblemInfoMenu from '@/components/pages/problem/new/problemInfoMenu';
import Underline from '@/components/underline';
import { StoneColor } from '@/libs/domain/baduk/baduk';
import { Editor } from '@/libs/domain/baduk/editor';
import { Level } from '@/libs/domain/level';
import capitalize from '@/libs/utils/capitalize';
import { ProblemResult, ProblemType } from '@/types/problem';
import { List } from 'immutable';
import Image from 'next/image';
import React, { useState } from 'react';

const makeProblemInfoMenuUi = (title: string) => (
  <div className={'h-50 flex justify-between items-center px-24 bg-white cursor-pointer select-none'}>
    <div />
    <span className='font-bold text-primary text-16'>{title}</span>
    <Image src={'/icons/chevron-down.svg'} alt='메뉴 선택 버튼' width={12} height={6} />
  </div>
);

interface ProblemInfo {
  type: ProblemType;
  level: Level;
  firstTurn: StoneColor;
  result: ProblemResult;
}

const initialProblemInfo: ProblemInfo = {
  type: '사활',
  level: 'gold',
  firstTurn: 'BLACK',
  result: '살리는 문제',
};

const New = () => {
  const [problemInfo, setProblemInfo] = useState<ProblemInfo>(initialProblemInfo);
  const [shapeMaker, setShapeMaker] = useState(new Editor({ dimensions: 13, changeTurnMode: 'manual' }));
  const [correctAnswerMakers, setCorrectAnswerMakers] = useState<List<Editor>>(
    List([new Editor({ dimensions: 13, changeTurnMode: 'auto' })]),
  );
  const [wrongAnswerMakers, setWrongAnswerMakers] = useState<List<Editor>>(List([]));

  const problemTypeMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.type === '사활',
      content: <div className='font-medium text-black text-16'>사활</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, type: '사활' })),
    },
    {
      selected: problemInfo.type === '맥',
      content: <div className='font-medium text-black text-16'>맥</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, type: '맥' })),
    },
  ];
  const problemLevelMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.level === 'bronze',
      content: <div className='font-medium text-black text-16'>Bronze</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'bronze' })),
    },
    {
      selected: problemInfo.level === 'silver',
      content: <div className='font-medium text-black text-16'>Silver</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'silver' })),
    },
    {
      selected: problemInfo.level === 'gold',
      content: <div className='font-medium text-black text-16'>Gold</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'gold' })),
    },
    {
      selected: problemInfo.level === 'platinum',
      content: <div className='font-medium text-black text-16'>Platinum</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'platinum' })),
    },
    {
      selected: problemInfo.level === 'diamond',
      content: <div className='font-medium text-black text-16'>Diamond</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'diamond' })),
    },
    {
      selected: problemInfo.level === 'ruby',
      content: <div className='font-medium text-black text-16'>Ruby</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'ruby' })),
    },
    {
      selected: problemInfo.level === 'master',
      content: <div className='font-medium text-black text-16'>Master</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, level: 'master' })),
    },
  ];
  const problemFirstTurnMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.firstTurn === 'BLACK',
      content: <div className='font-medium text-black text-16'>흑선</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, firstTurn: 'BLACK' })),
    },
    {
      selected: problemInfo.firstTurn === 'WHITE',
      content: <div className='font-medium text-black text-16'>백선</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, firstTurn: 'WHITE' })),
    },
  ];
  const problemResultMenus: CheckBoxDropDownMenu[] = [
    {
      selected: problemInfo.result === '살리는 문제',
      content: <div className='font-medium text-black text-16'>살리는 문제</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, result: '살리는 문제' })),
    },
    {
      selected: problemInfo.result === '죽이는 문제',
      content: <div className='font-medium text-black text-16'>죽이는 문제</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, result: '죽이는 문제' })),
    },
    {
      selected: problemInfo.result === '패',
      content: <div className='font-medium text-black text-16'>패</div>,
      onSelect: () => setProblemInfo((prev) => ({ ...prev, result: '패' })),
    },
  ];

  const makeAnswerMakerSameWithShape = (shape: Editor) =>
    new Editor({
      dimensions: 13,
      basicBoard: shape.scenes.last()?.board,
      changeTurnMode: 'auto',
      nextTurn: problemInfo.firstTurn,
    });

  const handleChangeShapeMaker = (newEditor: Editor) => {
    // 정답도나 오답도가 변경된 상태인지
    const answerMakersChanged =
      correctAnswerMakers.size > 1 ||
      wrongAnswerMakers.size > 1 ||
      !correctAnswerMakers.get(0)?.scenes.last()?.board.equals(shapeMaker.scenes.last()?.board);
    if (answerMakersChanged) {
      // 모달로 물어보기
      // resetAnswerMakers();
    }
    setShapeMaker(newEditor);
    setCorrectAnswerMakers(List([makeAnswerMakerSameWithShape(newEditor)]));
    setWrongAnswerMakers(List());
  };
  const handleChangeCorrectAnswerMaker = (newEditor: Editor, index: number) => {
    // 로직
    setCorrectAnswerMakers((prev) => prev.set(index, newEditor));
  };
  const handleChangeWrongAnswerMaker = (newEditor: Editor, index: number) => {
    // 로직
    setWrongAnswerMakers((prev) => prev.set(index, newEditor));
  };

  return (
    <Layout>
      <main className='py-50 px-20 lg:px-150 xl:px-200'>
        <div className=' w-full p-50 pb-100 rounded-20 bg-white'>
          <h1 className=' text-24 font-bold text-primary mb-100'>문제 생성하기</h1>
          <h3 className='text-20 font-bold text-primary mb-30'>문제 정보</h3>
          <div className='rounded-8 flex border-1 border-solid border-primary mb-50'>
            <div className=' w-[25%] border-r border-solid border-primary'>
              <div className='bg-primary text-white text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary rounded-tl-6'>
                문제 유형
              </div>
              <DropDownMenu contents={<ProblemInfoMenu title={problemInfo.type} className=' rounded-bl-8' />}>
                <CheckBoxDropDown menus={problemTypeMenus} className='w-full top-10' />
              </DropDownMenu>
            </div>
            <div className=' w-[25%] border-r border-solid border-primary'>
              <div className=' bg-bg_1 text-primary text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary'>
                레벨
              </div>
              <DropDownMenu contents={<ProblemInfoMenu title={capitalize(problemInfo.level)} />}>
                <CheckBoxDropDown menus={problemLevelMenus} className='w-full top-10' />
              </DropDownMenu>
            </div>
            <div className=' w-[25%] border-r border-solid border-primary'>
              <div className=' bg-primary text-white text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary'>
                차례
              </div>
              <DropDownMenu contents={<ProblemInfoMenu title={problemInfo.firstTurn === 'BLACK' ? '흑선' : '백선'} />}>
                <CheckBoxDropDown menus={problemFirstTurnMenus} className='w-full top-10' />
              </DropDownMenu>
            </div>
            <div className=' w-[25%]'>
              <div className='bg-bg_1 text-primary text-16 font-bold py-14 flex justify-center items-center border-b border-solid border-primary rounded-tr-8'>
                결과
              </div>
              <DropDownMenu contents={<ProblemInfoMenu title={problemInfo.result} className=' rounded-br-8' />}>
                <CheckBoxDropDown menus={problemResultMenus} className='w-full top-10' />
              </DropDownMenu>
            </div>
          </div>
          <h4 className=' text-16 font-bold text-primary mb-10'>힌트</h4>
          <input
            type='text'
            placeholder='힌트 없음'
            className=' w-full p-5 border-b-1 border-gray text-14 mb-100 placeholder:text-14'
          />
          <h3 className='text-20 font-bold text-primary mb-30'>문제도</h3>
          <ProblemEditor
            editor={shapeMaker}
            editorSize={600}
            hasBwSwitch
            setEditor={handleChangeShapeMaker}
            className=' mb-50'
          />
          <Underline className=' mb-50' />
          <h3 className='text-20 font-bold text-primary mb-30'>정답도</h3>
          {correctAnswerMakers.map((maker, i) => (
            <ProblemEditor
              key={i}
              editor={maker}
              editorSize={600}
              hasBwSwitch={false}
              title={`0${i + 1}`}
              showDeleteBtn
              showSequences
              setEditor={(newEditor: Editor) => {
                handleChangeCorrectAnswerMaker(newEditor, i);
              }}
              deleteEditor={() => setCorrectAnswerMakers((prev) => prev.remove(i))}
              className=' mb-50'
            />
          ))}
          <button
            className=' mb-50 py-8 px-35 bg-bg_1 text-16 font-bold text-primary border-1 border-solid border-primary rounded-12'
            onClick={() => setCorrectAnswerMakers((prev) => prev.push(makeAnswerMakerSameWithShape(shapeMaker)))}
          >
            정답도 추가하기
          </button>
          <Underline className=' mb-50' />
          <h3 className='text-20 font-bold text-primary mb-10'>실패도</h3>
          <h6 className=' text-gray font-normal text-12 mb-30'>실패도는 필수 항목이 아닙니다.</h6>
          {wrongAnswerMakers.map((maker, i) => (
            <ProblemEditor
              key={i}
              editor={maker}
              editorSize={600}
              hasBwSwitch={false}
              title={`0${i + 1}`}
              showDeleteBtn
              showSequences
              setEditor={(newEditor: Editor) => {
                handleChangeWrongAnswerMaker(newEditor, i);
              }}
              deleteEditor={() => setWrongAnswerMakers((prev) => prev.remove(i))}
              className=' mb-50'
            />
          ))}
          <button
            className=' mb-50 py-8 px-35 bg-bg_1 text-16 font-bold text-primary border-1 border-solid border-primary rounded-12'
            onClick={() => setWrongAnswerMakers((prev) => prev.push(makeAnswerMakerSameWithShape(shapeMaker)))}
          >
            실패도 추가하기
          </button>
          <Underline className=' mb-100' />
          <div className='w-full flex justify-center'>
            <button className='py-8 px-50 bg-primary text-white font-bold text-16 rounded-full'>문제 업로드</button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default New;
