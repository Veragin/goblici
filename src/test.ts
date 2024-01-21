import { checkSame } from './buildTree/checkSame';
import { Draw, PlayerAWon, PlayerBWon } from './errors';
import { movesByAddingNewUnit, movesByMovingUnit, nextMoves } from './buildTree/moves';
import { createStep, parseStep } from './utils';
import { TBoard } from './constants';
import { checkMove } from './buildTree/checkMove';

// check win

const checkWinStep = (step: string, expect: 'DRAW' | 'PLAYERA' | 'PLAYERB' | 'NOTHING') => {
    try {
        const board = parseStep(step);
        checkMove(board);
        if (expect !== 'NOTHING') throw new Error(`${step} - Expected ${expect} got NOTHING`);
    } catch (e) {
        if (e instanceof Draw) {
            if (expect !== 'DRAW') throw new Error(`${step} - Expected ${expect} got DRAW`);
            return;
        }
        if (e instanceof PlayerAWon) {
            if (expect !== 'PLAYERA') throw new Error(`${step} - Expected ${expect} got PLAYERA`);
            return;
        }
        if (e instanceof PlayerBWon) {
            if (expect !== 'PLAYERB') throw new Error(`${step} - Expected ${expect} got PLAYERB`);
            return;
        }
        throw e;
    }
};

const case1 = 'A;3A;1A;2A;1B;;2B;;;';
checkWinStep(case1, 'PLAYERA');
const case2 = 'A;3A;1A;2A;1B;3B;2B;;;';
checkWinStep(case2, 'PLAYERA');
const case3 = 'A;3A;;2A;1B;3A;2B;;;1A';
checkWinStep(case3, 'PLAYERA');
const case4 = 'A;3A;;2B;1B;3B;2B;1B;;1A';
checkWinStep(case4, 'PLAYERB');
const case5 = 'A;;;;;;;;;1A';
checkWinStep(case5, 'NOTHING');

console.log('check win done');

// moves

const checkMoves = (moves: TBoard[], expect: number, baseBoard: TBoard) => {
    if (moves.length !== expect) {
        console.log(`Wrong number of errors of ${baseBoard.step}, expected ${expect} moves.`);
        console.log(moves);
        throw new Error();
    }
};

const board1 = parseStep('A;;;;;;3B;2B;1B;1A');
const moves1 = movesByAddingNewUnit(board1, '2A');
checkMoves(moves1, 1, board1);

const board2 = parseStep('A;;;;;3A;3B;2B;1B;1A');
const moves2 = movesByMovingUnit(board2, 4);
checkMoves(moves2, 3, board2);

const board3 = parseStep('A;;1B2A3A;;;3A;;3B;3B;');
const moves3 = nextMoves(board3);
checkMoves(moves3, 3, board3);

console.log('moves done');

// checkSame

const checkSameStep = (step: string) => {
    const board = parseStep(step);
    const res = checkSame(board);
    if (!res) return null;
    return createStep(res);
};

const mainStep = 'A;3A;;;;;;;;';
checkSameStep(mainStep);
checkSameStep('A;;;;;;;3A;;');
checkSameStep('A;;;3A;;;;;;');

// nextMoves

/*const moves3 = nextMoves(board);
console.log(moves3);*/

console.log('Test were successful');
