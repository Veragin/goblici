import { TNextOptions } from './buildTree';
import { Draw, PlayerAWon, PlayerBWon, checkWin } from './checkWin';
import { ALL_UNITS, TBoard, TUnit } from './constants';

export const nextMoves = (board: TBoard): TNextOptions => {
    const player = board.playerTurn;

    const allUsedUnits = board.board.flatMap((unit) => unit);
    const usedUnits = allUsedUnits.filter((unit) => unit[1] === player);
    const notUsedTypes = ALL_UNITS[player].filter(
        (type) => usedUnits.reduce((r, u) => r + Number(u === type), 0) < 2
    );

    try {
        const nextBoards: TBoard[] = [];
        notUsedTypes.forEach((unit) => {
            const bs = movesByAddingNewUnit(board, unit);
            nextBoards.push(...bs);
        });

        board.board.forEach((d, index) => {
            const bs = movesByMovingUnit(board, index);
            nextBoards.push(...bs);
        });

        return nextBoards;
    } catch (e) {
        if (e instanceof Draw) {
            return {
                board,
                state: 'DRAW',
            };
        }
        if (e instanceof PlayerAWon) {
            return {
                board,
                state: 'PLAYER_A',
            };
        }
        if (e instanceof PlayerBWon) {
            return {
                board,
                state: 'PLAYER_B',
            };
        }
        console.error(e);
        return [];
    }
};

export const movesByAddingNewUnit = (board: TBoard, unit: TUnit) => {
    const res: TBoard[] = [];

    for (let i in board.board) {
        if (!canAddUnitToTile(unit, board.board[i])) continue;

        const newBoard = copyBoardWithOponentsTurn(board);
        newBoard.board[i].push(unit);
        checkWin(newBoard);
        res.push(newBoard);
    }

    return res;
};

export const movesByMovingUnit = (board: TBoard, index: number) => {
    const units = board.board[index];
    if (units.length === 0) return [];
    const unit = units[units.length - 1];
    if (unit[1] !== board.playerTurn) return [];

    const res: TBoard[] = [];

    for (let i in board.board) {
        if (Number(i) === index) continue;
        if (!canAddUnitToTile(unit, board.board[i])) continue;

        const newBoard = copyBoardWithOponentsTurn(board);
        newBoard.board[i].push(unit);
        newBoard.board[index].pop();
        checkWin(newBoard);
        res.push(newBoard);
    }

    return res;
};

const canAddUnitToTile = (unit: TUnit, tile: TUnit[]) => {
    if (tile.length === 0) return true;
    return Number(tile[tile.length - 1][0]) < Number(unit[0]);
};

const copyBoardWithOponentsTurn = (board: TBoard): TBoard => {
    return {
        playerTurn: board.playerTurn === 'A' ? 'B' : 'A',
        board: board.board.map((tiles) => [...tiles]),
    };
};
