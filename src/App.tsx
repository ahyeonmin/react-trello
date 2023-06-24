import React from 'react';
import { styled } from 'styled-components';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useRecoilSnapshot, useRecoilState } from 'recoil';
import { toDoState } from './atoms';

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
const Card = styled.div`
  margin-bottom: 20px;
  padding: 5px 10px;
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
`;

function App() {
  const [ toDos ] = useRecoilState(toDoState);
  const onDragEnd = ({ destination, source }: DropResult) => { // 드래그가 끝났을 때 실행되는 함수
    console.log("draggin finished!")
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Droppable droppableId='one'>
            {(magic) => (
              <Board ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <Draggable key={index} draggableId={toDo} index={index}>
                    {(magic) => <Card ref={magic.innerRef} {...magic.draggableProps} {...magic.dragHandleProps}> {toDo} </Card>}
                  </Draggable>
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