import { Draw, PlayerAWon, PlayerBWon, checkWin } from './checkWin';
import { nextMoves, parseStep } from './gobllici';

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

nextMoves(case1);
nextMoves(case2);
nextMoves(case3);

console.log('Test were successful');
