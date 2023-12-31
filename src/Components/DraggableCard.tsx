import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import { BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineClose, AiOutlineCheckCircle } from 'react-icons/ai'
import { toDoState } from "../atoms";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { easeInOut, motion } from "framer-motion";

const Card = styled.div<{ isDragging: boolean }>`
    margin-bottom: 10px;
    margin: 10px;
    padding: 10px;
    background-color: ${(props) => props.theme.cardColor};
    box-shadow: 0px 0px 10px ${(props) => props.theme.CardBoxShadowColor1}, 0px 0px 5px ${(props) => props.theme.CardBoxShadowColor2};
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
const EditForm = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #AFB3B5;
    input {
        width: 190px;
        font-size: 12px;
        border: none;
        background: none;
        color: ${(props) => props.theme.textColor};
    }
    button {
        color: #AFB3B5;
        cursor: pointer;
        &:hover {
            color: #2D2D2D;
        }
    }
`;
const CardInfo = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 7px 0 0 2px;
    color: #AFB3B5;
    font-size: 11px;
`;
const CardIcons = styled.div`
    display: flex;
    gap: 6px;
    opacity: 0;
    div {
        &:hover {
            color: ${(props) => props.theme.iconHoverColor};
        }
    }
`;

interface IDraggableCard {
    toDoId: number;
    toDoText: string;
    index: number;
    boardId: string;
    timestamp: string;
};
interface IForm {
    toDo: string;
}

function DraggableCard({ toDoId, toDoText, index, boardId, timestamp }: IDraggableCard) {
    const [ edited, setEdited ] = useState(true);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const [ toDos ,setToDos ] = useRecoilState(toDoState);
    const onClickedEditToDo = () => {
        setEdited(!edited);
    }
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
    const onEditToDo = ({ toDo }: IForm) => {
        const editedToDo = {
            id: toDoId,
            text: toDo,
        };
        setToDos((allBoards) => {
            var crrTodo = [...allBoards[boardId]]; // 1) 현재 Board의 toDo 가져오기
            crrTodo.splice(index, 1, editedToDo); // 2) 현재 Card를 지우고 수정한 ToDo 넣기
            return {
                ...allBoards, // 3) 나머지 Board들 불러오기
                [boardId]: crrTodo // 4) 현재 보드에 남은 toDo 넣어서 보여주기
            }; 
          });
        setEdited(!edited);
    };
    return (
        <>
        <Draggable key={toDoId} draggableId={toDoId + ""} index={index} /* key와 draggableId가 같아야 함 */>
            {(provided, snapshot) =>
                <Card
                    isDragging={snapshot.isDragging} // * snapshot의 isDragging: 드래그 할 때
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, ease: easeInOut }}
                    >
                    { edited ?
                        <>
                            {toDoText}
                            <CardInfo>
                                <div> {timestamp} </div>
                                <CardIcons className="cardIcons">
                                    <div>
                                        <BsFillPencilFill
                                            onClick={onClickedEditToDo}
                                        />
                                    </div>
                                    <div>
                                        <AiOutlineClose
                                            onClick={onDeleteToDo}
                                            style={{ position: "relative", bottom: "0.5px", fontSize: "13px" }}
                                        />
                                    </div>
                                </CardIcons>
                            </CardInfo>
                        </> :
                            <EditForm onSubmit={handleSubmit(onEditToDo)}>
                                <input {...register("toDo", { required: true })} defaultValue={toDoText} autoFocus />
                                <button type="submit">
                                    <AiOutlineCheckCircle
                                        onClick={handleSubmit(onEditToDo)}
                                        style={{ fontSize: "16px" }}
                                    />
                                </button>
                            </EditForm>
                    }
                    </motion.div>
                </Card>}
        </Draggable>
        </>
    );
}

export default React.memo(DraggableCard); // props가 변화한 항목만 리렌더링 (성능 최적화! 버그 발생 및 성능 저하 주의)