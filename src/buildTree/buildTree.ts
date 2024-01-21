import { checkSame } from './checkSame';
import { INIT_STEP, INIT_STEP_2, TBoard, TTree } from '../constants';
import { nextMoves } from './moves';
import { createStep, parseStep } from '../utils';
import { PlayerAWon, PlayerBWon } from '../errors';

export const tree: TTree = {};

let notSolvedBoards: Record<string, TBoard> = {};
let notSolvedNextLevelBoards: Record<string, TBoard> = {};
let active = 0;
let nextRoundLength = 0;

export const buildTree = (maxDepth: number) => {
    const initBoard = parseStep(INIT_STEP);
    notSolvedBoards = { [initBoard.step]: initBoard };

    for (let depth = 0; depth < maxDepth; depth++) {
        console.log('ROUND', depth + 1);
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
        if (Number(i) % 5000 === 4999) {
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

export const processBoard = (board: TBoard) => {
    const step = board.step;

    const sameBoard = checkSame(board);
    if (sameBoard) {
        tree[step] = {
            state: 'SAME',
            board: [sameBoard.step],
        };
        return;
    }

    let nextBoards;
    try {
        nextBoards = nextMoves(board);
    } catch (e) {
        if (e instanceof PlayerAWon || e instanceof PlayerBWon) {
            tree[step] = {
                state: e instanceof PlayerAWon ? 'PLAYER_A' : 'PLAYER_B',
                board: [e.board.step],
            };
        } else {
            console.error(e);
        }
        return;
    }

    if (nextBoards.length === 0) {
        tree[step] = {
            state: board.playerTurn === 'A' ? 'PLAYER_B' : 'PLAYER_A',
            board: [],
        };
        return;
    }

    tree[step] = {
        state: 'NONE',
        board: nextBoards.map((b) => b.step),
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
