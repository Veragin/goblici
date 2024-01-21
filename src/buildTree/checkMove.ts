import { TBoard } from '../constants';
import { NotAMove, PlayerAWon, PlayerBWon } from '../errors';

const indexes = [0, 1, 2];
const futureState: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
const winState: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

export const checkMove = (board: TBoard) => {
    for (let i of indexes) {
        for (let j of indexes) {
            const index = i * 3 + j;
            const tile = board.board[index];
            if (tile.length === 0) {
                futureState[i][j] = 0;
                winState[i][j] = 0;
                continue;
            }
            futureState[i][j] =
                tile[tile.length - 1] === board.playerTurn ? 10 : -parseInt(tile[tile.length - 2]);
            winState[i][j] = tile[tile.length - 1] === 'A' ? 1 : -1;
        }
    }

    checkWin(board);

    // future
    indexes.forEach((i) => checkFuture(board, i, 0, i, 1, i, 2));
    indexes.forEach((j) => checkFuture(board, 0, j, 1, j, 2, j));
    checkFuture(board, 0, 0, 1, 1, 2, 2);
    checkFuture(board, 0, 2, 1, 1, 2, 0);
};

const checkFuture = (
    board: TBoard,
    i1: number,
    j1: number,
    i2: number,
    j2: number,
    i3: number,
    j3: number
) => {
    const v = futureState[i1][j1] + futureState[i2][j2] + futureState[i3][j3];
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

    if (tile1Value + tile2Value + tile3Value !== 8) {
        throw new NotAMove();
    }
};

const checkWin = (board: TBoard) => {
    let didAWin = false;
    let didBWin = false;
    const check = (v: number) => {
        if (v === 3) didAWin = true;
        if (v === -3) didBWin = true;
    };

    winState.forEach((row) => check(row[0] + row[1] + row[2]));
    indexes.forEach((j) => check(winState[0][j] + winState[1][j] + winState[2][j]));
    check(winState[0][0] + winState[1][1] + winState[2][2]);
    check(winState[0][2] + winState[1][1] + winState[2][0]);

    if (didAWin) {
        if (didBWin) {
            if (board.playerTurn === 'A') {
                throw new PlayerAWon(board);
            }
            throw new PlayerBWon(board);
        }
        throw new PlayerAWon(board);
    }
    if (didBWin) {
        throw new PlayerBWon(board);
    }
};
