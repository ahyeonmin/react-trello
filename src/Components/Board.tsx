import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 200px;
    padding-top: 15px;
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

interface IAreaProps {
    isDraggingOver: boolean;
    draggingFromThisWith: boolean;
};

const Area = styled.div<IAreaProps>`
    background-color: ${(props) => props.isDraggingOver ? "#9DADC4" : props.draggingFromThisWith ? "#546699" : "none"};
    flex-grow: 1; // 영역을 맨 아래까지 이어지도록 해서 드래그 영역을 넓힘
    transition: background-color 0.2s ease-in;
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
                {(provided, snapshot) => (
                    <Area
                        isDraggingOver={snapshot.isDraggingOver} // * snapshot의 isDraggingOver: 드래그해서 보드에 들어왔을 때
                        draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)} // * snapshot의 draggingFromThisWith: 드래그해서 보드를 떠났을 때 (뭐든 존재하기만 한다면 true)
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {toDos.map((toDo, index) => (
                            <DraggableCard key={toDo} index={index} toDo={toDo} />
                        ))}
                        {provided.placeholder} {/* Card 이동 시 Board 사이즈 유지 */}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    );
}

export default Board;