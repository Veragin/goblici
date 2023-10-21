import { TPlayer, TBoard } from './constants';

const state: (TPlayer | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];
export const checkWin = (board: TBoard) => {
    for (let i in state) {
        for (let j in state[i]) {
            const index = Number(i) * 3 + Number(j);
            const units = board.board[index];
            if (units.length === 0) {
                state[i][j] = null;
                continue;
            }
            state[i][j] = units[units.length - 1][1] as TPlayer;
        }
    }

    const didAWin = checkStateWinOfPlayer('A');
    const didBWin = checkStateWinOfPlayer('B');

    if (didAWin) {
        if (didBWin) throw new Draw();
        throw new PlayerAWon();
    }
    if (didBWin) throw new PlayerBWon();
};

const indexes = [0, 1, 2];
const checkStateWinOfPlayer = (player: TPlayer): boolean => {
    if (state.some((row) => row.every((t) => t === player))) return true;
    if (indexes.some((j) => state.every((row) => row[j] === player))) return true;
    if (indexes.every((i) => state[i][i] === player)) return true;
    if (indexes.every((i) => state[i][2 - i] === player)) return true;
    return false;
};

export class PlayerAWon extends Error {
    constructor() {
        super('Player A has won');
    }
}

export class PlayerBWon extends Error {
    constructor() {
        super('Player B has won');
    }
}

export class Draw extends Error {
    constructor() {
        super('Draw');
    }
}
