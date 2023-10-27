import { TBoard, TILE_SEPARATOR, TUnit, UNIT_SEPARATOR } from './constants';

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

export const checkSame = (board: TBoard) => {
    const allUsedUnits = board.board.flatMap((unit) => unit);
    const sorted = allUsedUnits.sort(unitSort);
    const unitString = board.playerTurn + sorted.join('');

    const similarBoards = register[unitString];
    if (similarBoards === undefined) {
        register[unitString] = [board];
        return;
    }

    const variants = modify.map((mod) => mod.map((i) => board.board[i]));
    //const variantSteps = variants.map(variant => createStepOfBoard(variant));
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

const createStepOfBoard = (b: TBoard['board']) =>
    b.map((units) => units.join(UNIT_SEPARATOR)).join(TILE_SEPARATOR);

const unitSort = (a: TUnit, b: TUnit) =>
    a[0] === b[0] ? (a[1] === 'A' ? -1 : 1) : Number(b[0]) - Number(a[0]);
