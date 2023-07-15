import { atom } from "recoil"
import { recoilPersist } from "recoil-persist";

export interface ITodo {
    id: number;
    text: string;
}

interface IToDoState { // 유저가 Board를 추가할 수 있도록
    [key: string]: ITodo[]
}

// sessionStorage
const { persistAtom } = recoilPersist({
    key: "persist",
    storage: sessionStorage,
});

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "새로운 보드": [],
    },
    effects_UNSTABLE: [persistAtom], // sessionStorage
});

export const boardModalState = atom<boolean>({
    key: "BoardModal",
    default: false,
});