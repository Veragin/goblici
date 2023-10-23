import { checkSame } from './checkSame';
import { Draw, PlayerAWon, PlayerBWon, checkWin } from './checkWin';
import { INIT_STEP, TBoard, TEndState } from './constants';
import { nextMoves } from './moves';
import { createStep, parseStep } from './utils';

export const tree: Record<
    string,
    {
        board: TBoard;
        next: TBoard[] | TBoard | TEndState;
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
    try {
        checkWin(board);
        const sameBoard = checkSame(board);

        if (sameBoard) {
            tree[step] = {
                board,
                next: sameBoard,
            };
            return;
        }

        const nextBoards = nextMoves(board);
        tree[step] = {
            board,
            next: nextBoards,
        };
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
    } catch (e) {
        if (e instanceof Draw) {
            tree[step] = {
                board,
                next: 'DRAW',
            };
            return;
        }
        if (e instanceof PlayerAWon) {
            tree[step] = {
                board,
                next: 'PLAYER_A',
            };
            return;
        }
        if (e instanceof PlayerBWon) {
            tree[step] = {
                board,
                next: 'PLAYER_B',
            };
            return;
        }
        console.error(e);
    }
};
