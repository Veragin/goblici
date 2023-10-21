import { Draw, PlayerAWon, PlayerBWon, checkWin } from './checkWin';
import { parseStep } from './gobllici';
import { movesByAddingNewUnit, movesByMovingUnit, nextMoves } from './moves';

// check win

const checkWinStep = (step: string, expect: 'DRAW' | 'PLAYERA' | 'PLAYERB' | 'NOTHING') => {
    try {
        const board = parseStep(step);
        checkWin(board);
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
checkWinStep(case2, 'DRAW');
const case3 = 'A;3A;;2A;1B;3A;2B;;;1A';
checkWinStep(case3, 'PLAYERA');
const case4 = 'A;3A;;2B;1B;3B;2B;1B;;1A';
checkWinStep(case4, 'PLAYERB');
const case5 = 'A;;;;;;;;;1A';
checkWinStep(case5, 'NOTHING');

// moves

const board = parseStep(case1);
const moves1 = movesByAddingNewUnit(board, '2A');
if (moves1.length !== 6) throw new Error();

const moves2 = movesByMovingUnit(board, 0);
if (moves2.length !== 8) throw new Error();

// nextMOves

const moves3 = nextMoves(case1);
console.log(moves3);

console.log('Test were successful');
