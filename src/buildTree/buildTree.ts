import { checkSame } from './checkSame';
import { INIT_STEP, INIT_STEP_2, TBoard, TEndState } from '../constants';
import { nextMoves } from './moves';
import { createStep, parseStep } from '../utils';

export type TNextOptions = TBoard[] | { board?: TBoard; state: TEndState };
export const tree: Record<
    string,
    {
        board: TBoard;
        next: TNextOptions;
    }
> = {};

let notSolvedBoards: Record<string, TBoard> = {};
let notSolvedNextLevelBoards: Record<string, TBoard> = {};
let active = 0;
let nextRoundLength = 0;

export const buildTree = () => {
    const initBoard = parseStep(INIT_STEP);
    notSolvedBoards = { [initBoard.step]: initBoard };

    for (let depth = 0; depth < 7; depth++) {
        console.log('ROUND', depth);
        processLevel();
    }

    return tree;
};

const processLevel = () => {
    const boardsToSolve = Object.values(notSolvedBoards);
    if (boardsToSolve.length === 0) return;
    const time = new Date().getTime();
    active = 0;
    nextRoundLength = 0;

    for (let i in boardsToSolve) {
        processBoard(boardsToSolve[i]);
        if (Number(i) % 5000 === 0) {
            console.log(Number(i) / boardsToSolve.length);
        }
    }

    console.log('tree length', Object.keys(tree).length);
    console.log('to process', nextRoundLength);
    console.log(`active ${active} of ${boardsToSolve.length}`);
    console.log('timeMs', new Date().getTime() - time);
    console.log('');

    notSolvedBoards = notSolvedNextLevelBoards;
    notSolvedNextLevelBoards = {};
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

    if (nextBoards.length === 0) {
        tree[step] = {
            board,
            next: {
                state: board.playerTurn === 'A' ? 'PLAYER_B' : 'PLAYER_A',
            },
        };
        return;
    }

    tree[step] = {
        board,
        next: nextBoards,
    };

    active++;
    nextBoards.forEach((nextBoard) => {
        if (
            tree[nextBoard.step] === undefined &&
            notSolvedNextLevelBoards[nextBoard.step] === undefined &&
            notSolvedBoards[nextBoard.step] === undefined
        ) {
            notSolvedNextLevelBoards[nextBoard.step] = nextBoard;
            nextRoundLength++;
        }
    });
};
