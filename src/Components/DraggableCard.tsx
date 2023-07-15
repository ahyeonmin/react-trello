import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai'
import { timestampState, toDoState } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { time } from "console";

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
        .cardIcons {
            opacity: 1;
            transition: 0.1s ease-in;
        }
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
    opacity: 0;
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
    boardId: string;
};

function DraggableCard({ toDoId, toDoText, index, boardId }: IDraggableCard) {
    const [ timestamp, setTimestamp ] = useRecoilState(timestampState);
    setTimestamp(() => {
        var dateName = ['일', '월', '화', '수', '목', '금', '토'];
        var month = new Date().getMonth() + 1;
        var date = new Date().getDate();
        var day = dateName[new Date().getDay()];
        console.log(timestamp);
        return ( month + "/" + date + " (" + day + ")" );
    });
    const setToDos = useSetRecoilState(toDoState);
    const onDeleteToDo = () => {
        setToDos((allBoards) => {
            const crrTodo = [...allBoards[boardId]]; // 1) 현재 Board의 toDo 가져오기
            crrTodo.splice(index, 1); // 2) 현재 index로 toDo 삭제
            return {
                ...allBoards, // 3) 나머지 Board들 불러오기
                [boardId]: crrTodo // 4) 현재 보드에 남은 toDo 넣어서 보여주기
            }
        });
    };
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
                        <div> {timestamp} </div>
                        <CardIcons className="cardIcons">
                            <div> <BsFillPencilFill /> </div>
                            <div>
                                <AiOutlineClose
                                    onClick={onDeleteToDo}
                                    style={{ position: "relative", bottom: "0.5px", fontSize: "13px" }}
                                />
                            </div>
                        </CardIcons>
                    </CardInfo>
                </Card>}
        </Draggable>
    );
}

export default React.memo(DraggableCard); // props가 변화한 항목만 리렌더링 (성능 최적화! 버그 발생 및 성능 저하 주의)