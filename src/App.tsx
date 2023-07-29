import React from 'react';
import { ThemeProvider, styled } from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import { boardModalState, isDarkModeState, toDoState } from './atoms';
import Board from './Components/Board';
import { FiSun, FiMoon, FiPlus } from 'react-icons/fi';
import { BsTrello } from 'react-icons/bs';
import BoardModal from './Components/BoardModal';
import { darkTheme, lightTheme } from './theme';
import { easeInOut, motion } from 'framer-motion';

const Wrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.textColor};
`;
const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.topColor};
  border-bottom: 1px solid ${(props) => props.theme.topBorderColor};
  width: 100%;
  height: 4vh;
  gap: 5px;
  color: ${(props) => props.theme.topTextColor};
  font-size: 14px;
`;
const Logo = styled.div`
`;
const Content = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 96vh;
  background: linear-gradient(to top, ${(props) => props.theme.bgColor}, ${(props) => props.theme.baseBgColor});
`;
const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(100, 1fr);
  overflow: scroll;
  padding: 20px 10px;
  &::-webkit-scrollbar {
     display: none;
  }
`;
const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;
const IconBox = styled(motion.div)`
  width: 120px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${(props) => props.theme.iconBoxBgColor};
  box-shadow: 0px 0px 10px ${(props) => props.theme.CardBoxShadowColor1}, 0px 0px 5px ${(props) => props.theme.CardBoxShadowColor2};
  cursor: pointer;
`;

function App() {
  const [ toDos, setToDos ] = useRecoilState(toDoState);
  const [boardModal, setBoardModal] = useRecoilState(boardModalState);
  const onDragEnd = ({ draggableId, destination, source }: DropResult) => { // 드래그가 끝났을 때 실행되는 함수
    if (!destination) return; // destination이 없다면 종료
    // <SAME board movement>
    if(destination.droppableId === source.droppableId) { // 참이라면 한 개의 같은 보드에서 움직이고 있다는 것
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]]; // source.droppableId로 부터 board 복사 (To do, Doing, Done)
        const taskObj = boardCopy[source.index]; // 옮기려고 하는 to do object 전체를 복사
        boardCopy.splice(source.index, 1); // 1) 최근에 움직여진 아이템을 삭제
        boardCopy.splice(destination.index, 0, taskObj); // 2) 삭제된 아이템을 (아무것도 삭제하지 않고) 도착한 지점에 다시 넣기, 제자리에 놓는 경우 destination이 없을 수 있음
        return {
          ...allBoards, // 1) 나머지 board들을 불러오고,
          [source.droppableId]: boardCopy // 2) 최근에 움직여진 board에 변형된 보드 넣기 (key값에 변수를 넣을 경우 대괄호로 묶어야 함)
        };
      });
    }
    // <CROSS board movement>
    if(destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj); // 삭제된 아이템을 움직임이 끝난 board에 넣기
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard
        }
      });
    }
  };
  const onThemeSwitch = () => {
    isDarkModeSet((prev) => !prev);
  };
  const onAddBoard = () => {
    setBoardModal(true);
  };
  const [isDarkMode, isDarkModeSet] = useRecoilState(isDarkModeState);
  return (
    <ThemeProvider theme={ isDarkMode ? lightTheme : darkTheme }>
      <Wrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: easeInOut }}
      >
        <Top> 
          <BsTrello />
          <Logo> Trello </Logo>
        </Top>
        <Content>
        <DragDropContext onDragEnd={onDragEnd}>
          <Boards>
            {Object.keys(toDos).map((boardId) => <Board key={boardId} toDos={toDos[boardId]} boardId={boardId}/>)}
            {boardModal && <BoardModal />}
          </Boards>
          </DragDropContext>
        </Content>
        <Bottom>
          <IconBox
            onClick={onThemeSwitch}
            style={{ left: "0px", bottom: "0px", borderTopRightRadius: "50px", fontSize: "55px" }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
          >
            <motion.div whileHover={{ scale: 1.15 }}>
              { isDarkMode ? <FiSun /> : <FiMoon /> }
            </motion.div>
          </IconBox>
          <IconBox
            onClick={onAddBoard}
            style={{ right: "0px", bottom: "0px", borderTopLeftRadius: "50px", fontSize: "62px" }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
          >
            <motion.div whileHover={{ scale: 1.15 }}>
              <FiPlus />
            </motion.div>
          </IconBox>
        </Bottom>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;