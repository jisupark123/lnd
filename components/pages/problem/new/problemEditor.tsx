import useEditor from '@/hooks/useEditor';
import { Editor, editorToolkit } from '@/libs/domain/baduk/editor';
import React, { HTMLAttributes } from 'react';
import BoardUi from '@/components/baduk/boardUi';
import { Move } from '@/libs/domain/baduk/baduk';
import EditorTools from './editorTools';
import DeleteBtn from './deleteBtn';

interface Props extends HTMLAttributes<HTMLDivElement> {
  editor: Editor;
  editorSize: number;
  hasBwSwitch: boolean;
  title?: string;
  showDeleteBtn?: boolean;
  showSequences?: boolean;
  setEditor: (newEditor: Editor) => void;
  deleteEditor?: () => void;
}

const ProblemEditor: React.FC<Props> = ({
  editor,
  editorSize,
  hasBwSwitch,
  title,
  showDeleteBtn,
  showSequences,
  setEditor,
  deleteEditor,
  ...props
}) => {
  const currentScene = editorToolkit.currentScene(editor);
  const addMove = (move: Move) => {
    setEditor(editorToolkit.addMoveToEditorWithoutError(editor, move));
  };

  return (
    <div className={props.className ?? ''}>
      <div className=' flex items-center gap-10 mb-20'>
        {title && <span className=' text-primary font-bold text-16'>{title}</span>}
        {showDeleteBtn && deleteEditor && <DeleteBtn onClick={deleteEditor} />}
      </div>
      <EditorTools editor={editor} hasBwSwitch={hasBwSwitch} setEditor={setEditor} />
      <BoardUi {...currentScene} addMove={addMove} size={editorSize} showSequences={showSequences} />
    </div>
  );
};

export default ProblemEditor;
