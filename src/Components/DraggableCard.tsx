import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  margin-bottom: 10px;
  margin: 10px;
  padding: 5px 10px;
  background-color: ${(props) => props.theme.cardColor};
  box-shadow: 2px 5px 8px ${(props) => props.isDragging ? "#000104" : "none"};
  border-radius: 5px;
  color: ${(props) => props.theme.boardColor};
  transition: background-color 0.1s ease-in;
`;

interface IDraggableCard {
    toDoId: number;
    toDoText: string;
    index: number;
};

function DraggableCard({ toDoId, toDoText, index }: IDraggableCard) {
    return (
        <Draggable key={toDoId} draggableId={toDoId + ""} index={index} /* key와 draggableId가 같아야 함 */>
            {(provided, snapshot) =>
                <Card
                    isDragging={snapshot.isDragging} // * snapshot의 isDragging: 드래그 할 때
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {toDoText}
                </Card>}
        </Draggable>
    );
}

export default React.memo(DraggableCard); // props가 변화한 항목만 리렌더링 (성능 최적화! 버그 발생 및 성능 저하 주의)