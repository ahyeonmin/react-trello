import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { BsFillPencilFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 274px;
    padding: 11px 0;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    box-shadow: 0px 0px 10px #afb3b580, 0px 0px 5px #afb3b542;
    margin: 0 5px;
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
    padding: 0 12px;
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
            color: #2D2D2D;
        }
    }
`;
const Form = styled.form`
    padding: 0 10px;
    input {
        width: 93%;
        border: none;
        padding: 10px;
        box-shadow: 0px 0px 10px #afb3b55f, 0px 0px 5px #afb3b535;
        border-radius: 5px;
        font-size: 12px;
    }
`;

interface IAreaProps {
    isDraggingOver: boolean;
    draggingFromThisWith: boolean;
};
const Area = styled.div<IAreaProps>`
    background-color: ${(props) => props.isDraggingOver ? "#ecf0f185" : "none"};
    flex-grow: 1; // 영역을 맨 아래까지 이어지도록 해서 드래그 영역을 넓힘
    transition: background-color 0.1s ease-in-out;
`;

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
};
interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
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
    const onDeleteBoard = () => {
        setToDos((allBoards) => {
            const copiedBoard = { ...allBoards };
            delete copiedBoard[boardId];
            const result = copiedBoard;
            return result;
        })
    };
    return (
        <Wrapper>
            <TitleWrapper>
                <Title>{boardId}</Title>
                <BoardIcons className="boardIcons">
                    <div> <BsFillPencilFill /> </div>
                    <div>
                        <AiOutlineClose
                            onClick={onDeleteBoard}
                            style={{ position: "relative", bottom: "0.5px", fontSize: "13px" }}
                        />
                    </div>
                </BoardIcons>
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
                            <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} boardId={boardId}/>
                        ))}
                        {provided.placeholder} {/* Card 이동 시 Board 사이즈 유지 */}
                    </Area>
                )}
            </Droppable>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("toDo", { required: true })} type="text" placeholder={`+ 카드를 추가하세요.`} />
            </Form>
        </Wrapper>
    );
}

export default Board;