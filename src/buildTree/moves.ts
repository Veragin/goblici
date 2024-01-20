import { checkFuture } from './checkFuture';
import { ALL_UNITS, TBoard, TTile, TUnit } from '../constants';
import { createStep, unitSort } from '../utils';

export const nextMoves = (board: TBoard) => {
    const player = board.playerTurn;

    const usedUnits = board.usedUnits.filter((unit) => unit[1] === player);
    const notUsedTypes = ALL_UNITS[player].filter(
        (type) => usedUnits.reduce((r, u) => r + Number(u === type), 0) < 2
    );

    const nextBoards: TBoard[] = [];
    notUsedTypes.forEach((unit) => {
        const bs = movesByAddingNewUnit(board, unit);
        nextBoards.push(...bs);
    });

    board.board.forEach((d, index) => {
        const bs = movesByMovingUnit(board, index);
        nextBoards.push(...bs);
    });

    nextBoards.forEach((board) => {
        board.step = createStep(board);
    });
    return nextBoards;
};

export const movesByAddingNewUnit = (board: TBoard, unit: TUnit) => {
    const res: TBoard[] = [];

    for (let i in board.board) {
        if (!canAddUnitToTile(unit, board.board[i])) continue;

        const newBoard = copyBoardWithOponentsTurn(board);
        newBoard.board[i] += unit;
        newBoard.usedUnits.push(unit);
        newBoard.usedUnits.sort(unitSort);
        try {
            checkFuture(newBoard);
            res.push(newBoard);
        } catch {}
    }

    return res;
};

export const movesByMovingUnit = (board: TBoard, index: number) => {
    const tile = board.board[index];
    if (tile.length === 0) return [];
    const unit = tile.slice(-2) as TUnit;
    if (unit[1] !== board.playerTurn) return [];

    const res: TBoard[] = [];
    const newTileValue = tile.slice(0, -2);

    for (let i in board.board) {
        if (Number(i) === index) continue;
        if (!canAddUnitToTile(unit, board.board[i])) continue;

        const newBoard = copyBoardWithOponentsTurn(board);
        newBoard.board[i] += unit;
        newBoard.board[index] = newTileValue;
        try {
            checkFuture(newBoard);
            res.push(newBoard);
        } catch {}
    }

    return res;
};

const canAddUnitToTile = (unit: TUnit, tile: TTile) => {
    if (tile.length === 0) return true;
    return Number(tile[tile.length - 2]) < Number(unit[0]);
};

const copyBoardWithOponentsTurn = (board: TBoard): TBoard => {
    return {
        step: '',
        playerTurn: board.playerTurn === 'A' ? 'B' : 'A',
        board: [...board.board],
        usedUnits: [...board.usedUnits],
    };
};
