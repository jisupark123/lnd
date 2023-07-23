import { BoardUiConfigs } from '@/components/baduk/boardUi';
import { Move } from '@/libs/domain/baduk/baduk';
import { Editor, editorToolkit } from '@/libs/domain/baduk/editor';
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
  const toggleChangeTurnStoneColor = () => {
    setEditor((prev) => editorToolkit.toggleChangeTurnStoneColor(prev));
  };
  const toggleChangeTurnMode = () => {
    setEditor((prev) => editorToolkit.toggleChangeTurnMode(prev));
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
    toggleChangeTurnStoneColor,
    toggleChangeTurnMode,
    moveFirst,
    moveLast,
    moveTo,
  };
};

export default useEditor;
