export const TILE_SEPARATOR = ';';
export const INIT_STEP = 'A;;;;;;;;;';
export const INIT_STEP_2 = 'B;1A;;;;;;;;';

export const ALL_UNITS = {
    A: ['1A', '2A', '3A'],
    B: ['1B', '2B', '3B'],
} as const;

export type TPlayer = 'A' | 'B';

type TUnitA = (typeof ALL_UNITS.A)[number];
type TUnitB = (typeof ALL_UNITS.B)[number];
export type TStep = string;
export type TUnit = TUnitA | TUnitB;
export type TTile = string; // `TUnitTUnitTUnit`

export type TBoard = {
    step: string;
    playerTurn: TPlayer;
    board: TTile[];
    usedUnits: TUnit[];
};

export const STATES = ['PLAYER_A', 'PLAYER_B', 'DRAW', 'SAME', 'NONE'] as const;
export type TEndState = (typeof STATES)[number];

export type TTree = Record<TStep, { board: TStep[]; state: TEndState }>;
