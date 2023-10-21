import { ALL_UNITS, TBoard, TILE_SEPARATOR, TPlayer, TUnit, UNIT_SEPARATOR } from './constants';
import { movesByAddingNewUnit, movesByMovingUnit } from './moves';

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
