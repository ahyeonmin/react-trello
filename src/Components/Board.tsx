import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  min-height: 200px;
  padding: 0 10px;
  padding-top: 20px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
`;

const Title = styled.div`
    padding-bottom: 10px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.cardColor};
`;

interface IBoardProps {
    toDos: string[];
    boardId: string;
};

function Board({ toDos, boardId }: IBoardProps) {
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Droppable droppableId={boardId}>
                {(magic) => (
                    <div ref={magic.innerRef} {...magic.droppableProps}>
                        {toDos.map((toDo, index) => (
                            <DraggableCard key={toDo} index={index} toDo={toDo} />
                        ))}
                        {magic.placeholder} {/* Card 이동 시 Board 사이즈 유지 */}
                    </div>
                )}
            </Droppable>
        </Wrapper>
    );
}

export default Board;