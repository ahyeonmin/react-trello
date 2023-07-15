import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { boardModalState, toDoState } from "../atoms";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
`;
const Modal = styled.div`
  width: 20vw;
  height: 15vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 130px auto;
  border-radius: 7px;
  background-color: ${(props) => props.theme.boardColor};
  box-shadow: 0px 0px 10px #afb3b55f, 0px 0px 5px #afb3b535;
`;
const Title = styled.div`
    font-size: 14px;
    padding-bottom: 20px;
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
        width:70%;
        margin-bottom: 40px;
        border: none;
        box-shadow: 0px 0px 10px #afb3b55f, 0px 0px 5px #afb3b535;
        padding:10px;
        border-radius: 5px;
        font-size: 12px;
    }
`;
const Buttons = styled.div`
    display: flex;
    gap: 30px;
    font-size: 14px;
`;
const Button = styled.button`
    padding: 8px 50px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px #afb3b55f, 0px 0px 5px #afb3b535;
    cursor: pointer;
`;

interface IForm {
    board: string;
}

function BoardModal() {
    const [boardModal, setBoardModal] = useRecoilState(boardModalState);
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onCloseClicked = () => {
        setBoardModal(false);
    };
    const onSubmit = ({ board }: IForm) => {
        setToDos((allBoards) => {
            return {
                ...allBoards,  // 1) 기존의 모든 Board를 가져오기
                [board]: [], //2) input 입력값으로 Board 이름을 정하고, 빈 배열로 새로운 Board 추가하기
            }
        });
        setBoardModal(false);
    };
    return (
        <Wrapper>
            <Modal>
                <Title> 새로운 보드의 이름을 입력하세요. </Title>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("board", { required: true })} type="text" />
                    <Buttons> {/* Form 안에 button이 2개 이상일 경우 type 명시해야 함 */}
                        <Button onClick={onCloseClicked} type="button"> 닫기 </Button>
                        <Button type="submit"> 확인 </Button>
                    </Buttons>
                </Form>
            </Modal>
        </Wrapper>
    )
}

export default BoardModal;