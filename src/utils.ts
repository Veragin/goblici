import { TBoard, TILE_SEPARATOR, TPlayer, TUnit } from './constants';

export const parseStep = (step: string): TBoard => {
    const [playerTurn, ...tiles] = step.split(TILE_SEPARATOR);

    const units = (/\w\w/g.exec(tiles.join('')) ?? []) as TUnit[];
    units.sort(unitSort);

    return {
        step,
        playerTurn: playerTurn as TPlayer,
        board: tiles,
        usedUnits: units,
    };
};

export const createStep = (board: TBoard): string => {
    return [board.playerTurn, ...board.board].join(TILE_SEPARATOR);
};

export const unitSort = (a: TUnit, b: TUnit) =>
    a[0] === b[0] ? (a[1] === 'A' ? -1 : 1) : Number(b[0]) - Number(a[0]);
