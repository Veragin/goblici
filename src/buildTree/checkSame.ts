import { TBoard, TILE_SEPARATOR, TStep, TUnit } from '../constants';

const register: Record<string, TBoard[]> = {};

const mirrorVTemplate = [6, 7, 8, 3, 4, 5, 0, 1, 2];
const mirrorHTemplate = [2, 1, 0, 5, 4, 3, 8, 7, 6];
const rotate90Template = [6, 3, 0, 7, 4, 1, 8, 5, 2];
const rotate180Template = rotate90Template.map((i) => rotate90Template[i]);
const rotate270Template = rotate90Template.map((i) => rotate180Template[i]);
const mirrorVRotate90 = rotate90Template.map((i) => mirrorVTemplate[i]);
const mirrorHRotate90 = rotate90Template.map((i) => mirrorHTemplate[i]);

const modify = [
    mirrorVTemplate,
    mirrorHTemplate,
    rotate90Template,
    rotate180Template,
    rotate270Template,
    mirrorVRotate90,
    mirrorHRotate90,
];

export const getSameSteps = (board: TBoard) => {
    const variants = modify.map((mod) => mod.map((i) => board.board[i]));
    return variants.map((variant) => `${board.playerTurn};${variant.join(TILE_SEPARATOR)}`);
};

export const checkSame = (board: TBoard) => {
    const unitString = board.playerTurn + board.usedUnits.join('');

    const similarBoards = register[unitString];
    if (similarBoards === undefined) {
        register[unitString] = [board];
        return;
    }

    const variants = modify.map((mod) => mod.map((i) => board.board[i]));
    for (let b of similarBoards) {
        if (variants.some((variant) => areBoardsSame(variant, b.board))) {
            return b;
        }
    }

    similarBoards.push(board);
};

const areBoardsSame = (a: TBoard['board'], b: TBoard['board']) => {
    return createStepOfBoard(a) === createStepOfBoard(b);
};

const createStepOfBoard = (b: TBoard['board']) => b.join(TILE_SEPARATOR);
