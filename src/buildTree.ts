import { checkSame } from './checkSame';
import { INIT_STEP, TBoard, TEndState } from './constants';
import { nextMoves } from './moves';
import { createStep, parseStep } from './utils';
import fs from 'fs';

export type TNextOptions = TBoard[] | { board: TBoard; state: TEndState };
export const tree: Record<
    string,
    {
        board: TBoard;
        next: TNextOptions;
    }
> = {};

let notSolvedBoards: TBoard[] = [];
let notSolvedNextLevelBoards: TBoard[] = [];
let depth = 0;
let active = 0;

export const buildTree = () => {
    const initBoard = parseStep(INIT_STEP);
    notSolvedBoards = [initBoard];
    processLevel();

    const data = notSolvedBoards.map((b) => createStep(b));
    const s = data.join('\n');
    fs.writeFileSync('./boards.txt', s);
};

const processLevel = () => {
    if (notSolvedBoards.length === 0) return;
    if (depth > 3) return;
    depth++;
    active = 0;

    for (let board of notSolvedBoards) {
        processBoard(board);
    }

    notSolvedBoards = notSolvedNextLevelBoards;
    notSolvedNextLevelBoards = [];

    console.log('ROUND', depth);
    console.log('tree length', Object.keys(tree).length);
    console.log('to process', notSolvedBoards.length);
    console.log('active', active);

    processLevel();
};

const processBoard = (board: TBoard) => {
    const step = createStep(board);

    if (depth < 5) {
        const sameBoard = checkSame(board);

        if (sameBoard) {
            tree[step] = {
                board,
                next: {
                    state: 'SAME',
                    board: sameBoard,
                },
            };
            return;
        }
    }

    const nextBoards = nextMoves(board);
    tree[step] = {
        board,
        next: nextBoards,
    };

    if (!Array.isArray(nextBoards)) return;

    active++;
    nextBoards.forEach((nextBoard) => {
        const nextStep = createStep(nextBoard);
        if (
            tree[nextStep] === undefined &&
            !notSolvedNextLevelBoards.includes(nextBoard) &&
            !notSolvedBoards.includes(nextBoard)
        ) {
            notSolvedNextLevelBoards.push(nextBoard);
        }
    });
};
