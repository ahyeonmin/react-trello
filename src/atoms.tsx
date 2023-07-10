import { atom } from "recoil"

export interface ITodo {
    id: number;
    text: string;
}

interface IToDoState { // 유저가 Board를 추가할 수 있도록
    [key: string]: ITodo[]
}

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "할 일": [],
        "수행 중...": [],
        "다 했다!": [],
        "아이디어": [],
    },
});