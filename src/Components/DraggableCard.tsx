import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";

const Card = styled.div`
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  color: ${(props) => props.theme.boardColor};
`;

interface IDraggableCard {
    toDo: string;
    index: number;
};

function DraggableCard({ toDo, index }: IDraggableCard) {
    return (
        <Draggable key={toDo} draggableId={toDo} index={index} /* key와 draggableId가 같아야 함 */>
            {(magic) => <Card ref={magic.innerRef} {...magic.draggableProps} {...magic.dragHandleProps}> {toDo} </Card>}
        </Draggable>
    );
}

export default React.memo(DraggableCard); // props가 변화한 항목만 리렌더링 (성능 최적화! 버그 발생 및 성능 저하 주의)