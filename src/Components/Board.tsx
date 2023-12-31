import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, timestampState, toDoState } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineClose, AiOutlineCheckCircle } from 'react-icons/ai'
import { useState } from "react";
import { easeInOut, motion } from "framer-motion";

const Wrapper = styled(motion.div)`
    display: flex;
    flex-direction: column;
    width: 274px;
    padding: 11px 0;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    box-shadow: 0px 0px 10px ${(props) => props.theme.BoardBoxShadowColor1}, 0px 0px 5px ${(props) => props.theme.BoardBoxShadowColor2};
    margin: 0px 5px;
    min-height: 60px;
    height: fit-content; // 컨텐츠(카드) 크기에 맞추기 !!! ㅎㅎ 신난다
    &:hover {
        .boardIcons {
            opacity: 1;
            transition: 0.1s ease-in;
        }
    }
`;
const TitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 5px 12px;
`;
const Title = styled.div`
    font-size: 14px;
`;
const BoardIcons = styled.div`
    display: flex;
    gap: 6px;
    color: #AFB3B5;
    font-size: 11px;
    opacity: 0;
    cursor: pointer;
    div {
        &:hover {
            color: ${(props) => props.theme.iconHoverColor};
        }
    }
`;
const EditForm = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 274px;
    color: #AFB3B5;
    input {
        width: 100%;
        font-size: 14px;
        border: none;
        background: none;
        padding-bottom: 1px;
        color: ${(props) => props.theme.textColor};
    }
    button {
        padding-top: 4px;
        color: #AFB3B5;
        cursor: pointer;
        &:hover {
            color: #2D2D2D;
        }
    }
`;
const Form = styled.form`
    padding: 0 10px;
`;
const Input = styled.input`
    width: 92%;
    border: none;
    padding: 10px;
    box-shadow: 0px 0px 10px ${(props) => props.theme.CardBoxShadowColor1}, 0px 0px 5px ${(props) => props.theme.CardBoxShadowColor2};
    border-radius: 5px;
    font-size: 12px;
    background-color: ${(props) => props.theme.inputColor};
    color: ${(props) => props.theme.textColor};
`
const Area = styled.div<IAreaProps>`
    background-color: ${(props) => props.isDraggingOver ? props.theme.isDraggingOverColor : "none"};
    flex-grow: 1; // 영역을 맨 아래까지 이어지도록 해서 드래그 영역을 넓힘
    transition: background-color 0.1s ease-in-out;
    padding-bottom: 10px;
`;

interface IAreaProps {
    isDraggingOver: boolean;
    draggingFromThisWith: boolean;
};
interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
};
interface IForm {
    toDo: string;
    board: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const [ edited, setEdited ] = useState(true);
    const setToDos = useSetRecoilState(toDoState);
    const [ timestamp, setTimestamp ] = useRecoilState(timestampState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const { register: editedResgister, handleSubmit: editedHandleSubmit } = useForm<IForm>();
    setTimestamp(() => {
        const dateName = ['일', '월', '화', '수', '목', '금', '토'];
        const month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        const day = dateName[new Date().getDay()];
        return ( month + "/" + date + " (" + day + ")" );
    });
    const onSubmit = ({ toDo }: IForm) => {
        const newToDo = {
            id: Date.now(), // 중복되지 않는 특별한 값
            text: toDo,
        };
        setToDos((allBoards) => {
            return {
                ...allBoards, // 1) 기존의 모든 Board를 가져오기
                [boardId]: [ ...allBoards[boardId], newToDo], // 2) 현재 있는 Board에, 새로운 요소를 추가하고, 기존의 요소들을 다 넣기
            }
        });
        setValue("toDo", ""); // 입력 후 엔터치면 빈칸으로
    };
    const onClickedEditBoard = () => {
        setEdited(!edited);
    }
    const onDeleteBoard = () => {
        setToDos((allBoards) => {
            const copiedBoard = { ...allBoards };
            delete copiedBoard[boardId];
            const result = copiedBoard;
            return result;
        });
    };
    const onEditBoard = ({ board }: IForm) => {
        setToDos((allBoards) => {
            const copiedBoard = { ...allBoards };
            const editingBoard = copiedBoard[boardId];
            delete copiedBoard[boardId];
            const result = { [board]: editingBoard, ...copiedBoard };
            return result;
        });
        setEdited(!edited);
    }
    return (
        <Wrapper
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: easeInOut }}
        >
            <TitleWrapper>
                { edited ?
                    <>
                        <Title>{boardId}</Title>
                        <BoardIcons className="boardIcons">
                            <div>
                                <BsFillPencilFill
                                    onClick={onClickedEditBoard}
                                />
                            </div>
                            <div>
                                <AiOutlineClose
                                    onClick={onDeleteBoard}
                                    style={{ position: "relative", bottom: "0.5px", fontSize: "13px" }}
                                />
                            </div>
                        </BoardIcons>
                    </> :
                        <EditForm onSubmit={editedHandleSubmit(onEditBoard)}>
                            <input {...editedResgister("board", { required: true })} defaultValue={boardId} autoFocus />
                            <button type="submit">
                                <AiOutlineCheckCircle
                                    onClick={editedHandleSubmit(onEditBoard)}
                                    style={{ fontSize: "16px" }}
                                />
                            </button>
                        </EditForm>
                }
            </TitleWrapper>
            <Droppable droppableId={boardId}>
                {(provided, snapshot) => (
                    <Area
                        isDraggingOver={snapshot.isDraggingOver} // * snapshot의 isDraggingOver: 드래그해서 보드에 들어왔을 때
                        draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)} // * snapshot의 draggingFromThisWith: 드래그해서 보드를 떠났을 때 (뭐든 존재하기만 한다면 true)
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {toDos.map((toDo, index) => (
                            <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} boardId={boardId} timestamp={timestamp}/>
                        ))}
                        {provided.placeholder} {/* Card 이동 시 Board 사이즈 유지 */}
                    </Area>
                )}
            </Droppable>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input {...register("toDo", { required: true })} type="text" placeholder={`+ 카드를 추가하세요.`} />
            </Form>
        </Wrapper>
    );
}

export default Board;