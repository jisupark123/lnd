import CheckBox from '@/components/check-box/check-box';
import LevelBar from '@/components/level-bar';
import CheckBoxDropDown, { CheckBoxDropDownMenu } from '@/components/menu/check-box_drop-down';
import DropDownMenu from '@/components/menu/drop-down-menu';
import BackDrop from '@/components/modal/backdrop';
import Switch from '@/components/switch/switch';
import { StoneColor } from '@/libs/domain/baduk/baduk';
import { Level } from '@/libs/domain/level';
import AppResponseType from '@/types/appResponseType';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [checked, setChecked] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<Level[]>(['bronze', 'silver']);
  const toggleLevel = (prevSelectLevels: Level[], selectedLevel: Level) => {
    if (prevSelectLevels.includes(selectedLevel)) {
      return prevSelectLevels.filter((level) => level !== selectedLevel);
    }
    return [...prevSelectLevels, selectedLevel];
  };
  const dropDownMenus: CheckBoxDropDownMenu[] = [
    {
      selected: selectedLevel.includes('bronze'),
      content: <div className='w-70 h-10 bg-bronze rounded-3' />,
      onSelect: () => setSelectedLevel((prev) => toggleLevel(prev, 'bronze')),
    },
    {
      selected: selectedLevel.includes('silver'),
      content: <div className='w-70 h-10 bg-silver rounded-3' />,
      onSelect: () => setSelectedLevel((prev) => toggleLevel(prev, 'silver')),
    },
    {
      selected: selectedLevel.includes('gold'),
      content: <div className='w-70 h-10 bg-gold rounded-3' />,
      onSelect: () => setSelectedLevel((prev) => toggleLevel(prev, 'gold')),
    },
    {
      selected: selectedLevel.includes('platinum'),
      content: <div className='w-70 h-10 bg-platinum rounded-3' />,
      onSelect: () => setSelectedLevel((prev) => toggleLevel(prev, 'platinum')),
    },
    {
      selected: selectedLevel.includes('diamond'),
      content: <div className='w-70 h-10 bg-diamond rounded-3' />,
      onSelect: () => setSelectedLevel((prev) => toggleLevel(prev, 'diamond')),
    },
    {
      selected: selectedLevel.includes('ruby'),
      content: <div className='w-70 h-10 bg-ruby rounded-3' />,
      onSelect: () => setSelectedLevel((prev) => toggleLevel(prev, 'ruby')),
    },
  ];

  const fetchRequest = async () => {
    const response = await axios.get<AppResponseType<{ ok: true }>>('/api/test');
    console.log(response.data.result);
  };
  return (
    <div style={{}} className='flex justify-center items-center h-screen bg-bg_1'>
      <DropDownMenu style={{ width: '150px' }} title='Lv'>
        <CheckBoxDropDown style={{ width: '150px', top: '10px' }} menus={dropDownMenus} />
      </DropDownMenu>
      <CheckBox checked={checked} toggleFn={() => setChecked((prev) => !prev)} />
      <Switch size='big' isOn={checked} toggleFn={() => setChecked((prev) => !prev)} />
      <BackDrop>
        <button onClick={fetchRequest}>눌러</button>
      </BackDrop>
    </div>
  );
}
