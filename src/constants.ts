export const TILE_SEPARATOR = ';';
export const UNIT_SEPARATOR = ',';
export const INIT_STEP = 'A;;;;;;;;;';

export const ALL_UNITS = {
    A: ['1A', '2A', '3A'],
    B: ['1B', '2B', '3B'],
} as const;

export type TPlayer = 'A' | 'B';

type TUnitA = (typeof ALL_UNITS.A)[number];
type TUnitB = (typeof ALL_UNITS.B)[number];
export type TUnit = TUnitA | TUnitB;

export type TBoard = {
    playerTurn: TPlayer;
    board: TUnit[][];
};

export type TEndState = 'PLAYER_A' | 'PLAYER_B' | 'DRAW' | 'SAME';
