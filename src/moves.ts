import { ALL_UNITS, TBoard, TUnit } from './constants';
import { createStep, parseStep } from './gobllici';

export const nextMoves = (step: string) => {
    const board = parseStep(step);

    const player = board.playerTurn;
    const allUsedUnits = board.board.flatMap((unit) => unit);
    const usedUnits = allUsedUnits.filter((unit) => unit[1] === player);
    const notUsedTypes = ALL_UNITS[player].filter(
        (type) => usedUnits.reduce((r, u) => r + Number(u === type), 0) < 2
    );

    const nextSteps: Set<string> = new Set();
    notUsedTypes.forEach((unit) => {
        const steps = movesByAddingNewUnit(board, unit);
        steps.forEach((step) => nextSteps.add(step));
    });

    board.board.forEach((d, index) => {
        const steps = movesByMovingUnit(board, index);
        steps.forEach((step) => nextSteps.add(step));
    });

    return nextSteps;
};

export const movesByAddingNewUnit = (board: TBoard, unit: TUnit) => {
    const res: string[] = [];

    for (let i in board.board) {
        if (!canAddUnitToTile(unit, board.board[i])) continue;

        const newBoard = copyBoardWithOponentsTurn(board);
        newBoard.board[i].push(unit);
        res.push(createStep(newBoard));
    }

    return res;
};

export const movesByMovingUnit = (board: TBoard, index: number) => {
    const units = board.board[index];
    if (units.length === 0) return [];
    const unit = units[units.length - 1];
    if (unit[1] !== board.playerTurn) return [];

    const res: string[] = [];

    for (let i in board.board) {
        if (Number(i) === index) continue;
        if (!canAddUnitToTile(unit, board.board[i])) continue;

        const newBoard = copyBoardWithOponentsTurn(board);
        newBoard.board[i].push(unit);
        newBoard.board[index].pop();
        res.push(createStep(newBoard));
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
