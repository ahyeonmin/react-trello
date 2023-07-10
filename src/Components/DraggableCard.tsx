import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai'

const Card = styled.div<{ isDragging: boolean }>`
    margin-bottom: 10px;
    margin: 10px;
    padding: 10px;
    background-color: ${(props) => props.theme.cardColor};
    box-shadow: 0px 0px 10px #afb3b55f, 0px 0px 5px #afb3b535;
    border-radius: 5px;
    line-height: 15px;
    font-size: 12px;
    &:hover {
        background-color: #afb3b535;
    }
    transition: background-color 0.1s ease-in;

`;
const CardInfo = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 0 0 2px;
    color: #AFB3B5;
    font-size: 11px;
`;
const CardIcons = styled.div`
    display: flex;
    gap: 6px;
    div {
        &:hover {
        color: #2D2D2D;
    }
    }
`;

interface IDraggableCard {
    toDoId: number;
    toDoText: string;
    index: number;
};

function DraggableCard({ toDoId, toDoText, index }: IDraggableCard) {
    function timestamp() {
        var dateName = ['일', '월', '화', '수', '목', '금', '토'];
        var month = new Date().getMonth() + 1;
        var date = new Date().getDate();
        var day = dateName[new Date().getDay()];
        return (month + "/" + date + " (" + day + ")");
    };
    const time = timestamp();
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
                    <CardInfo>
                        <div> {time} </div>
                        <CardIcons>
                            <div> <BsFillPencilFill /> </div>
                            <div>
                                <AiOutlineClose style={{ position: "relative", bottom: "0.5px", fontSize: "13px" }} />
                            </div>
                        </CardIcons>
                    </CardInfo>
                </Card>}
        </Draggable>
    );
}

export default React.memo(DraggableCard); // props가 변화한 항목만 리렌더링 (성능 최적화! 버그 발생 및 성능 저하 주의)