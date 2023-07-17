import { BoardUiConfigs } from '@/components/boardUi';
import { Move } from '@/lib/baduk';
import { Editor, editorToolkit } from '@/lib/editor';
import { useState } from 'react';

export interface UseEditorReturnType {
  editor: Editor;
  boardUIConfigs: BoardUiConfigs;
  deadStonesCount: {
    black: number;
    white: number;
  };
  changeNextTurn: () => void;
  changeTurnMode: () => void;
  moveFirst: () => void;
  moveLast: () => void;
  moveTo: (to: number) => void;
}

const useEditor = (initialEditor: Editor) => {
  const [editor, setEditor] = useState(initialEditor);
  const { board, sequences, currMove, nextTurn, deadStonesCount } = editorToolkit.currentScene(editor);
  const addMove = (move: Move) => {
    setEditor((prev) => editorToolkit.addMoveToEditorWithoutError(prev, move));
  };
  const changeNextTurn = () => {
    setEditor((prev) => editorToolkit.changeNextTurn(prev));
  };
  const changeTurnMode = () => {
    setEditor((prev) => editorToolkit.changeTurnMode(prev));
  };
  const moveFirst = () => {
    setEditor((prev) => editorToolkit.moveFirst(prev));
  };
  const moveLast = () => {
    setEditor((prev) => editorToolkit.moveLast(prev));
  };
  const moveTo = (to: number) => {
    setEditor((prev) => editorToolkit.moveTo(prev, to));
  };

  return {
    editor,
    boardUIConfigs: { board, sequences, currMove, nextTurn, addMove },
    deadStonesCount,
    changeNextTurn,
    changeTurnMode,
    moveFirst,
    moveLast,
    moveTo,
  };
};

export default useEditor;
