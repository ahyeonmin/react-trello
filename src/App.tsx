import React from 'react';
import { styled } from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms';
import Board from './Components/Board';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  max-width: 680px;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

function App() {
  const [ toDos, setToDos ] = useRecoilState(toDoState);
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => { // 드래그가 끝났을 때 실행되는 함수
    if (!destination) return; // destination이 없다면 종료
    // <SAME board movement>
    if(destination.droppableId === source.droppableId) { // 참이라면 한 개의 같은 보드에서 움직이고 있다는 것
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]]; // source.droppableId로 부터 board 복사 (To do, Doing, Done)
        const taskObj = boardCopy[source.index]; // 옮기려고 하는 to do object 전체를 복사
        boardCopy.splice(source.index, 1); // 1) 최근에 움직여진 아이템을 삭제
        boardCopy.splice(destination.index, 0, taskObj); // 2) 삭제된 아이템을 (아무것도 삭제하지 않고) 도착한 지점에 다시 넣기, 제자리에 놓는 경우 destination이 없을 수 있음
        return {
          ...allBoards, // 1) 나머지 board들을 불러오고,
          [source.droppableId]: boardCopy // 2) 최근에 움직여진 board에 변형된 보드 넣기 (key값에 변수를 넣을 경우 대괄호로 묶어야 함)
        };
      });
    }
    // <CROSS board movement>
    if(destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj); // 삭제된 아이템을 움직임이 끝난 board에 넣기
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard
        }
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => <Board key={boardId} toDos={toDos[boardId]} boardId={boardId}/>)}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;