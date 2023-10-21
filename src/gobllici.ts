import {
    ALL_UNITS,
    TBoard,
    TILE_SEPARATOR,
    TPlayer,
    TUnit,
    UNIT_SEPARATOR,
    WINSTATE,
} from './constants';

export const nextMoves = (step: string) => {
    const board = parseStep(step);

    const player = board.playerTurn;
    const allUsedUnits = board.board.flatMap((unit) => unit);
    const usedUnits = allUsedUnits.filter((unit) => unit[1] === player);
    const notUsedTypes = ALL_UNITS[player].filter(
        (type) => usedUnits.reduce((r, u) => r + Number(u === type), 0) < 2
    );
};

const movesByAddingNewUnit = (board: TBoard, unit: TUnit) => {
    const moves;
};

const copyBoardWithOponentsTurn = (board: TBoard): TBoard => {
    return {
        playerTurn: board.playerTurn === 'A' ? 'B' : 'A',
        board: board.board.map((tiles) => tiles.map((u) => u)),
    };
};

export const parseStep = (step: string): TBoard => {
    const [playerTurn, ...tiles] = step.split(TILE_SEPARATOR);
    const board = tiles.map((tile) => tile.split(UNIT_SEPARATOR).filter((u) => u !== ''));

    return {
        playerTurn: playerTurn as TPlayer,
        board: board as TUnit[][],
    };
};

export const createStep = (board: TBoard): string => {
    const tiles = board.board.map((units) => units.join(UNIT_SEPARATOR));
    return [board.playerTurn, ...tiles].join(TILE_SEPARATOR);
};
