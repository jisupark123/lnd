import { Editor, editorToolkit } from '@/libs/domain/baduk/editor';
import React from 'react';
import BwSwitch from '@/components/switch/bw-switch';
import ChevronLeftDouble from '../../../../public/icons/chevron-left--double.svg';
import ChevronLeft from '../../../../public/icons/chevron-left.svg';
import ChevronRight from '../../../../public/icons/chevron-right.svg';
import ChevronRightDouble from '../../../../public/icons/chevron-right--double.svg';

interface Props {
  editor: Editor;
  hasBwSwitch: boolean;
  setEditor: (newEditor: Editor) => void;
}

const EditorTools: React.FC<Props> = ({ editor, hasBwSwitch, setEditor }) => {
  const changeNextTurn = () => {
    setEditor(editorToolkit.changeNextTurn(editor));
  };

  const moveTo = (to: 'first' | 'last' | '-1' | '+1') => {
    if (to === 'first') {
      setEditor(editorToolkit.moveFirst(editor));
    } else if (to === 'last') {
      setEditor(editorToolkit.moveLast(editor));
    } else if (to === '-1') {
      setEditor(editorToolkit.moveTo(editor, -1));
    } else {
      setEditor(editorToolkit.moveTo(editor, +1));
    }
  };
  return (
    <div className='flex items-center gap-20 w-full mb-10 p-24 bg-bg_1 rounded-12'>
      {hasBwSwitch && <BwSwitch mode={editor.nextTurn} toggleFn={changeNextTurn} />}
      <button
        className=' border-1 border-solid border-primary py-4 px-12 bg-white rounded-12'
        onClick={() => moveTo('first')}
      >
        <ChevronLeftDouble width='24' color='#6042F8' />
      </button>
      <button
        className=' border-1 border-solid border-primary py-4 px-12 bg-white rounded-12'
        onClick={() => moveTo('-1')}
      >
        <ChevronLeft width='24' color='#6042F8' />
      </button>
      <button
        className=' border-1 border-solid border-primary py-4 px-12 bg-white rounded-12'
        onClick={() => moveTo('+1')}
      >
        <ChevronRight width='24' color='#6042F8' />
      </button>
      <button
        className=' border-1 border-solid border-primary py-4 px-12 bg-white rounded-12'
        onClick={() => moveTo('last')}
      >
        <ChevronRightDouble width='24' color='#6042F8' />
      </button>
    </div>
  );
};

export default EditorTools;
