import { useRecoilState } from "recoil";
import styled from "styled-components";
import { boardModalState } from "../atoms";

const Wrapper = styled.div`
    height: 100vh;
`;
const Modal = styled.div`
  width: 30vw;
  height: 30vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 100px auto;
  border-radius: 7px;
  background-color: white;
`;

function BoardModal() {
    const [boardModal, setBoardModal] = useRecoilState(boardModalState);
    const onCloseClicked = () => {
        setBoardModal(false);
    };
    return (
        <Wrapper>
            <Modal>
                <button onClick={onCloseClicked}> X </button>
                <div> 새로운 보드를 추가 </div>
                <input />
            </Modal>
        </Wrapper>
    )
}

export default BoardModal;