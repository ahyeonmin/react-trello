import { atom } from "recoil"

interface IToDoState { // 유저가 Board를 추가할 수 있도록
    [key: string]: string[]
}

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "To Do": ["a", "b"],
        "Doing": ["c", "d", "e"],
        "Done": ["f"],
    },
});