import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ProblemFilterParams } from './api/problem';
import Layout from '@/components/layout/layout';
import { Level } from '@/libs/domain/level';
import { ProblemInfo, ProblemOrderType, ProblemType } from '@/types/problem';
import { CheckBoxDropDownOptions } from '@/components/menu/checkBoxDropDownSelect';
import FilteringMenuUi from '@/components/pages/index/filteringMenuUi';
import RetryIcon from '../public/icons/retry.svg';
import orderMapping from '@/constants/orderMapping';
import Switch from '@/components/switch/switch';
import Problems from '@/components/pages/index/problems';
import { fetchProblems, filtersToParams } from '@/apis/problem';
import CheckBoxDropDownSelect from '@/components/menu/checkBoxDropDownSelect';

export interface ProblemFilter {
  levels: Level[];
  types: ProblemType[];
  order: ProblemOrderType;
  onlyUnsolved: boolean;
}

const initialProblemFilter: ProblemFilter = {
  levels: [],
  types: [],
  order: 'recent',
  onlyUnsolved: false,
};

function paramsToFilter(params: ProblemFilterParams): ProblemFilter {
  const { levels, types, order, status } = params;
  return {
    levels: typeof levels === 'string' ? [levels] : levels ?? [],
    types: typeof types === 'string' ? [types] : types ?? [],
    order: order ?? 'recent',
    onlyUnsolved: status === 'unsolved',
  };
}

export default function Home() {
  const router = useRouter();

  const { page, levels, types, status, order } = router.query as ProblemFilterParams;
  // const initialProblemFilter: ProblemFilter = {
  //   levels: typeof levels === 'string' ? [levels] : levels ?? [],
  //   types: typeof types === 'string' ? [types] : types ?? [],
  //   order: order ?? 'recent',
  //   onlyUnsolved: status === 'unsolved',
  // };
  const [problemFilter, setProblemFilter] = useState<ProblemFilter>(paramsToFilter({ levels, types, status, order }));
  const [problemState, setProblemState] = useState<{
    problems: ProblemInfo[] | null;
    isLoading: boolean;
    isError: boolean;
  }>({
    problems: null,
    isLoading: false,
    isError: false,
  });

  useEffect(() => {
    (async () => {
      setProblemState((prev) => ({ ...prev, isLoading: true }));
      const response = await fetchProblems(filtersToParams(problemFilter));
      setProblemState((prev) => ({ ...prev, isLoading: false }));
      if (response.status === 200) {
        setProblemState((prev) => ({ ...prev, problems: response.data.result.problems }));
      }
    })();
  }, [router.query, problemFilter]);

  const resetProblemFilter = () => {
    setProblemFilter(initialProblemFilter);
    router.push(`/?${filtersToParams(initialProblemFilter)}`, undefined, { scroll: false });
  };

  const levelMenuTitle = problemFilter.levels.length ? '선택된 레벨' : '모든 레벨';
  const problemTypeMenuTitle = problemFilter.types.length ? '선택된 유형' : '모든 유형';

  const toggleLevel = (prevSelectLevels: Level[], selectedLevel: Level) => {
    if (prevSelectLevels.includes(selectedLevel)) {
      return prevSelectLevels.filter((level) => level !== selectedLevel);
    }
    return [...prevSelectLevels, selectedLevel];
  };
  const toggleProblemType = (prevSelectType: ProblemType[], selectedType: ProblemType) => {
    if (prevSelectType.includes(selectedType)) {
      return prevSelectType.filter((type) => type !== selectedType);
    }
    return [...prevSelectType, selectedType];
  };

  const handleSelectLevelOption = (level: Level) => {
    const newFilter = { ...problemFilter, levels: toggleLevel(problemFilter.levels, level) };
    setProblemFilter(newFilter);
    router.push(`/?${filtersToParams(newFilter)}`, undefined, { scroll: false });
  };
  const handleSelectTypeOption = (problemType: ProblemType) => {
    const newFilter = { ...problemFilter, types: toggleProblemType(problemFilter.types, problemType) };
    setProblemFilter(newFilter);
    router.push(`/?${filtersToParams(newFilter)}`, undefined, { scroll: false });
  };

  const handleSelectOrderOption = (order: ProblemOrderType) => {
    const newFilter = { ...problemFilter, order };
    setProblemFilter(newFilter);
    router.push(`/?${filtersToParams(newFilter)}`, undefined, { scroll: false });
  };
  const handleToggleOnlySolvedSwitch = () => {
    console.log(problemFilter.onlyUnsolved);
    const newFilter = { ...problemFilter, onlyUnsolved: !problemFilter.onlyUnsolved };
    setProblemFilter(newFilter);
    router.push(`/?${filtersToParams(newFilter)}`, undefined, { scroll: false });
  };

  const levelOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemFilter.levels.includes('bronze'),
      content: <div className='w-70 h-10 bg-bronze rounded-3' />,
      value: 'bronze',
    },
    {
      selected: problemFilter.levels.includes('silver'),
      content: <div className='w-70 h-10 bg-silver rounded-3' />,
      value: 'silver',
    },
    {
      selected: problemFilter.levels.includes('gold'),
      content: <div className='w-70 h-10 bg-gold rounded-3' />,
      value: 'gold',
    },
    {
      selected: problemFilter.levels.includes('platinum'),
      content: <div className='w-70 h-10 bg-platinum rounded-3' />,
      value: 'platinum',
    },
    {
      selected: problemFilter.levels.includes('diamond'),
      content: <div className='w-70 h-10 bg-diamond rounded-3' />,
      value: 'diamond',
    },
    {
      selected: problemFilter.levels.includes('ruby'),
      content: <div className='w-70 h-10 bg-ruby rounded-3' />,
      value: 'ruby',
    },
  ];
  const problemTypeOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemFilter.types.includes('사활'),
      content: <div className=' font-medium text-black text-16'>사활</div>,
      value: '사활',
    },
    {
      selected: problemFilter.types.includes('맥'),
      content: <div className=' font-medium text-black text-16'>맥</div>,
      value: '맥',
    },
  ];

  const problemOrderOptions: CheckBoxDropDownOptions[] = [
    {
      selected: problemFilter.order === 'recent',
      content: <div className=' font-medium text-black text-16'>최신순</div>,
      value: 'recent',
    },
    {
      selected: problemFilter.order === 'acceptance_desc',
      content: <div className=' font-medium text-black text-16'>정답률 높은 문제</div>,
      value: 'acceptance_desc',
    },
    {
      selected: problemFilter.order === 'acceptance_asc',
      content: <div className=' font-medium text-black text-16'>정답률 낮은 문제</div>,
      value: 'acceptance_asc',
    },
  ];

  return (
    <Layout>
      <div className=' w-full h-240 md:h-330 bg-[#ECFAF7]'></div>
      <main className=' w-full lg:px-80 pt-20 lg:pt-50'>
        <div className='px-20 pb-50 '>
          {/* 문제 필터링 */}
          <div className=' flex items-center flex-wrap gap-10 sm:gap-20 mb-10'>
            <CheckBoxDropDownSelect
              contents={<FilteringMenuUi title={levelMenuTitle} className='w-130 sm:w-150' />}
              options={levelOptions}
              selectHandler={handleSelectLevelOption}
            />
            <CheckBoxDropDownSelect
              contents={<FilteringMenuUi title={problemTypeMenuTitle} className='w-130 sm:w-150' />}
              options={problemTypeOptions}
              closeOnSelect
              selectHandler={handleSelectTypeOption}
            />

            <CheckBoxDropDownSelect
              contents={<FilteringMenuUi title={orderMapping[problemFilter.order]} className='w-200' />}
              options={problemOrderOptions}
              closeOnSelect
              selectHandler={handleSelectOrderOption}
            />
          </div>

          {/* 필터 초기화 버튼 */}
          <button onClick={resetProblemFilter} className='flex items-center gap-5 mb-10'>
            <span className=' font-medium text-14 text-primary'>필터 초기화</span>
            <RetryIcon width='14' height='14' color='#6042F8' />
          </button>

          {/* 안 푼 문제만 버튼 */}
          <div className=' flex items-center justify-end gap-10 mb-20'>
            <span className=' font-medium text-16 text-primary'>안 푼 문제만</span>
            <Switch size='big' isOn={problemFilter.onlyUnsolved} toggleFn={handleToggleOnlySolvedSwitch} />
          </div>

          {/* 문제 렌더링 */}
          {problemState.problems && <Problems problems={problemState.problems} />}
        </div>
      </main>
    </Layout>
  );
}
