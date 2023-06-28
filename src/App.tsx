import React from 'react';
import { styled } from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms';
import DraggableCard from './Components/DraggableCard';

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
  max-width: 480px;
  grid-template-columns: repeat(1, 1fr);
`;
const Board = styled.div`
  min-height: 200px;
  padding: 20px 10px;
  padding-top: 30px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
`;

function App() {
  const [ toDos, setToDos ] = useRecoilState(toDoState);
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => { // 드래그가 끝났을 때 실행되는 함수
    if(!destination) return; // destination이 없으면 그냥 반환
    setToDos((crrToDo) => {
      const toDosCopy = [...crrToDo];
      toDosCopy.splice(source.index, 1); // 1) 최근에 움직여진 아이템을 삭제
      toDosCopy.splice(destination?.index, 0, draggableId); // 2) 삭제된 아이템을 (아무것도 삭제하지 않고) 도착한 지점에 다시 넣기, 제자리에 놓는 경우 destination이 없을 수 있음
      return toDosCopy;
    }) 
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Droppable droppableId='one'>
            {(magic) => (
              <Board ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <DraggableCard key={toDo} index={index} toDo={toDo} />
                ))}
                {magic.placeholder} {/* Card 이동 시 Board 사이즈 유지 */}
              </Board>
            )}
          </Droppable>
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;