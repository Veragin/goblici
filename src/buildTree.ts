import { checkSame } from './checkSame';
import { INIT_STEP, INIT_STEP_2, TBoard, TEndState } from './constants';
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
    if (depth > 5) return;
    const time = new Date().getTime();
    depth++;
    active = 0;

    for (let i in notSolvedBoards) {
        processBoard(notSolvedBoards[i]);
        if (Number(i) % 5000 === 0) {
            console.log(Number(i) / notSolvedBoards.length);
        }
    }

    notSolvedBoards = notSolvedNextLevelBoards;
    notSolvedNextLevelBoards = [];

    console.log('ROUND', depth);
    console.log('tree length', Object.keys(tree).length);
    console.log('to process', notSolvedBoards.length);
    console.log('active', active);
    console.log('timeMs', new Date().getTime() - time);
    console.log('');

    processLevel();
};

const processBoard = (board: TBoard) => {
    const step = createStep(board);

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
