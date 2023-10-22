import { Draw, PlayerAWon, PlayerBWon, checkWin } from './checkWin';
import { INIT_STEP, TEndState } from './constants';
import { nextMoves } from './moves';
import { parseStep } from './utils';

export const tree: Record<string, Set<string> | TEndState> = {};

let notSolvedSteps: string[] = [];
let notSolvedNextLevelSteps: string[] = [];
let depth = 0;

export const buildTree = () => {
    notSolvedSteps = [INIT_STEP];
    processLevel();

    console.log(Object.keys(tree).length);
    console.log(notSolvedSteps.length);
    console.log(notSolvedNextLevelSteps.length);
};

const processLevel = () => {
    if (notSolvedSteps.length === 0) return;
    if (depth > 2) return;
    depth++;

    for (let step of notSolvedSteps) {
        processStep(step);
    }

    notSolvedSteps = notSolvedNextLevelSteps;
    notSolvedNextLevelSteps = [];
    processLevel();
};

const processStep = (step: string) => {
    try {
        const board = parseStep(step);
        checkWin(board);
        const nextSteps = nextMoves(board);
        tree[step] = nextSteps;

        nextSteps.forEach((nextStep) => {
            if (
                tree[nextStep] === undefined &&
                !notSolvedNextLevelSteps.includes(nextStep) &&
                !notSolvedSteps.includes(nextStep)
            ) {
                notSolvedNextLevelSteps.push(nextStep);
            }
        });
    } catch (e) {
        if (e instanceof Draw) {
            tree[step] = 'DRAW';
            return;
        }
        if (e instanceof PlayerAWon) {
            tree[step] = 'PLAYER_A';
            return;
        }
        if (e instanceof PlayerBWon) {
            tree[step] = 'PLAYER_B';
            return;
        }
        console.error(e);
    }
};
