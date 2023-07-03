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
        "To Do": [{ id: 1, text: "test1" }, { id: 2, text: "test2" }],
        "Doing": [],
        "Done": [],
    },
});