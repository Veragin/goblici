import { TPlayer, TBoard } from './constants';
import { Draw, PlayerAWon, PlayerBWon } from './errors';

const state: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
const indexes = [0, 1, 2];

export const checkWin = (board: TBoard) => {
    for (let i in state) {
        for (let j in state[i]) {
            const index = Number(i) * 3 + Number(j);
            const tile = board.board[index];
            if (tile.length === 0) {
                state[i][j] = 0;
                continue;
            }
            state[i][j] = tile[tile.length - 1] === 'A' ? 1 : -1;
        }
    }

    let didAWin = false;
    let didBWin = false;
    const check = (v: number) => {
        if (v === 3) didAWin = true;
        if (v === -3) didBWin = true;
    };

    state.forEach((row) => check(row[0] + row[1] + row[2]));
    indexes.forEach((j) => check(state[0][j] + state[1][j] + state[2][j]));
    check(state[0][0] + state[1][1] + state[2][2]);
    check(state[0][2] + state[1][1] + state[2][0]);

    if (didAWin) {
        if (didBWin) throw new Draw(board);
        throw new PlayerAWon(board);
    }
    if (didBWin) throw new PlayerBWon(board);
};
