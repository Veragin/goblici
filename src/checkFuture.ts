import { TBoard } from './constants';
import { NotAMove } from './errors';

const state: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
const indexes = [0, 1, 2];

export const checkFuture = (board: TBoard) => {
    for (let i in state) {
        for (let j in state[i]) {
            const index = Number(i) * 3 + Number(j);
            const tile = board.board[index];
            if (tile.length === 0) {
                state[i][j] = 0;
                continue;
            }
            state[i][j] =
                tile[tile.length - 1] === board.playerTurn ? 10 : -parseInt(tile[tile.length - 2]);
        }
    }

    indexes.forEach((i) => check(board, i, 0, i, 1, i, 2));
    indexes.forEach((j) => check(board, 0, j, 1, j, 2, j));
    check(board, 0, 0, 1, 1, 2, 2);
    check(board, 0, 2, 1, 1, 2, 0);
};

const check = (
    board: TBoard,
    i1: number,
    j1: number,
    i2: number,
    j2: number,
    i3: number,
    j3: number
) => {
    const v = state[i1][j1] + state[i2][j2] + state[i3][j3];
    if (v < 18) return;
    if (v > 18) throw new NotAMove();

    const index1 = i1 * 3 + j1;
    const index2 = i2 * 3 + j2;
    const index3 = i3 * 3 + j3;
    const tile1 = board.board[index1];
    const tile2 = board.board[index2];
    const tile3 = board.board[index3];
    const tile1Value = Number(tile1[tile1.length - 2]);
    const tile2Value = Number(tile2[tile2.length - 2]);
    const tile3Value = Number(tile3[tile3.length - 2]);

    if (tile1Value + tile2Value + tile3Value !== 6) {
        throw new NotAMove();
    }
};
