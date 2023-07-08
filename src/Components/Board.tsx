import { Droppable } from "react-beautiful-dnd";
import { styled } from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 10px 0;
    background-color: ${(props) => props.theme.boardColor};
    border: 2px solid #d3d3d36f;
    border-radius: 5px;
    box-shadow: 2px 2px 2px #AFB3B5;
    margin: 0 5px;
    height: fit-content; // 컨텐츠(카드) 크기에 맞추기 !!! ㅎㅎ 신난다
`;
const Title = styled.div`
    padding: 0 0 10px 10px;
    font-size: 14px;
`;
const Form = styled.form`
    padding: 0 10px;
    input {
        width: 95%;
        border: none;
    }
`;

interface IAreaProps {
    isDraggingOver: boolean;
    draggingFromThisWith: boolean;
};
const Area = styled.div<IAreaProps>`
    background-color: ${(props) => props.draggingFromThisWith ? "#546699" : "none"};
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
                            <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} />
                        ))}
                        {provided.placeholder} {/* Card 이동 시 Board 사이즈 유지 */}
                    </Area>
                )}
            </Droppable>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("toDo", { required: true })} type="text" placeholder={`+ 메모를 추가하세요.`} />
            </Form>
        </Wrapper>
    );
}

export default Board;